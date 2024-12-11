import {
  Message as VercelChatMessage,
  StreamingTextResponse,
} from "ai";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai"; 
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

export const dynamic = "force-dynamic";
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX!;

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

export const QA_TEMPLATE = `You are a professional assistant specialized in Guatemalan law. Use the following pieces of context to answer the question at the end.
You should always attempt to answer the question, either by providing a direct answer or by clarifying the doubt behind the question.
If the question is not related to the provided context, politely respond that you are configured to only answer questions related to the legal context.

Current conversation:
{chat_history}

{context}

Question: {question}
Helpful answer in accordance with the law in markdown:`;

export async function POST(req: Request) {
  try {
    const pinecone = new PineconeClient();

    const embeddings = new OpenAIEmbeddings();
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex: index,
        textKey: 'text',
    });

  
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

    return new StreamingTextResponse(stream);

  } catch (e: any) {
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
