import {
  Message as VercelChatMessage,
  StreamingTextResponse,
  createStreamDataTransformer,
} from "ai";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai"; 
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { PineconeStore } from "@langchain/pinecone";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
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

export const QA_TEMPLATE = `You are an enthusiastic AI assistant. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
ONLY RESPONSE IN SPANISH.

Current conversation:
{chat_history}

{context}

Question: {question}
Helpful answer in markdown:`;

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
      outputParser: new HttpResponseOutputParser(),
    });

    const retrievedDocs = await retriever.invoke(currentMessageContent);

    console.log("Retrieved docs", retrievedDocs);

    const stream = await ragChain.stream({
      question: currentMessageContent,
      context: retrievedDocs,
      chat_history: formattedPreviousMessages.join('\n'),
    });

    // Respond with the stream
    return new StreamingTextResponse(
      stream.pipeThrough(createStreamDataTransformer())
    );
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
