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
import { StringOutputParser } from "@langchain/core/output_parsers";
import { pull } from "langchain/hub";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const dynamic = "force-dynamic";

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});
const pinecone = new PineconeClient();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

const TEMPLATE = `You are an assistant for question-answering
 tasks. Use the following pieces of retrieved context to answer 
 the question. If you don't know the answer, just say that you don't know. 
 Use three sentences maximum and keep the answer concise.

Question: {question} 

Context: {context} 

Current conversation: {chat_history}

Answer:`;

export async function POST(req: Request) {
  try {
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      maxConcurrency: 5,
    });
  
    const { messages } = await req.json();

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages.at(-1).content;

    const retriever = vectorStore.asRetriever({
      k: 5,
    });
    
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    const llm = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 });
  
    const ragChain = await createStuffDocumentsChain({
      llm,
      prompt,
      outputParser: new HttpResponseOutputParser(),
    });
    
    const retrievedDocs = await retriever.invoke(currentMessageContent);

    const stream = await ragChain.stream({
      question: currentMessageContent,
      context: retrievedDocs,
      chat_history: formattedPreviousMessages.join('\n'),
    });
    
    console.log(stream)
    
    const parser = new HttpResponseOutputParser();

    // Respond with the stream
    return new StreamingTextResponse(
      stream.pipeThrough(createStreamDataTransformer())
    );
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
