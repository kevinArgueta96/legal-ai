import {
  Message as VercelChatMessage,
  StreamingTextResponse,
} from "ai";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai"; 
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { getPineconeClient } from '@/lib/pinecone-client'
import { getVectorStore } from '@/lib/vector-store'

export const dynamic = "force-dynamic";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are an assistant for question-answering
 tasks. Use the following pieces of retrieved context to answer 
 the question. If you don't know the answer, just say that you don't know. 
 Use three sentences maximum and keep the answer concise.

Question: {question} 

Context: {context} @
Answer:`;

export const QA_TEMPLATE = `You are a professional assistant specialized in Guatemalan law. Use the following pieces of context to answer the question at the end.
You should always attempt to answer the question, either by providing a direct answer or by clarifying the doubt behind the question.
If the question is not related to the provided context, politely respond that you are configured to only answer questions related to the legal context.
ONLY RESPOND IN SPANISH.

Current conversation:
{chat_history}

{context}

Question: {question}
Helpful answer in accordance with the law in markdown:`;

export async function POST(req: Request) {
  try {
    const pinecone = await getPineconeClient();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);
    const embeddings = new OpenAIEmbeddings({
       model: "text-embedding-3-small",
    });

    /*const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      maxConcurrency: 10,
    });*/
    const vectorStore = await getVectorStore(pinecone);
  
    const { messages } = await req.json();

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages.at(-1).content;

    const retriever = vectorStore.asRetriever({
      k: 5,
    });
    
    const prompt = PromptTemplate.fromTemplate(QA_TEMPLATE);
    const llm = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 });
  
    const ragChain = await createStuffDocumentsChain({
      llm,
      prompt,
      outputParser: new StringOutputParser(),
    });

    const retrievedDocs = await retriever.invoke(currentMessageContent);

    const stream = await ragChain.stream({
      question: currentMessageContent,
      context: retrievedDocs,
      chat_history: formattedPreviousMessages.join('\n'),
    });


    // Respond with the stream
    // return new StreamingTextResponse(
    //   stream.pipeThrough(createStreamDataTransformer())
    // );
    return new StreamingTextResponse(stream);

  } catch (e: any) {
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
