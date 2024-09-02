import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { pull } from "langchain/hub";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { getPineconeClient } from '@/lib/pinecone-client'

const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });
  
  const pinecone = new PineconeClient();
// Will automatically read the PINECONE_API_KEY and PINECONE_ENVIRONMENT env vars
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

const initialConfig = async () => {
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
    maxConcurrency: 5,
    // You can pass a namespace here too
    // namespace: "foo",
  });

  return vectorStore;
};



const similaritySearch = async (question: string) => {
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
    maxConcurrency: 5,
    // You can pass a namespace here too
    // namespace: "foo",
  });

  console.log("INICIO EL PROCESO DE ENVIO PARA RETRIVER");

  const similaritySearch = await vectorStore.similaritySearch(
    question,
    2
  );

  let completeMessage = ''; // Inicializa la variable como una cadena vacía
  for (const doc of similaritySearch) {
    completeMessage += doc.pageContent + ` [${JSON.stringify(doc.metadata, null)}]\n`;
    // Concatenamos el contenido de la página y los metadatos a completeMessage
  }
  console.log("QA OBTENER OTRA");
  console.log(completeMessage);
  console.log("OTRO PROCESO");

  return similaritySearch;
};

export const similaritySearchAsUsingInAChain = async (question: string) => {
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
    maxConcurrency: 5,
    // You can pass a namespace here too
    // namespace: "foo",
  });

  console.log("INICIO EL PROCESO DE ENVIO");

  const retriever = vectorStore.asRetriever({
    k: 2,
  });
  
  const response = await retriever.invoke("biology");

  let completeMessage = ''; // Inicializa la variable como una cadena vacía
  /*for (const doc of response) {
    completeMessage += doc.pageContent + ` [${JSON.stringify(doc.metadata, null)}]\n`;
    // Concatenamos el contenido de la página y los metadatos a completeMessage
  }*/
  console.log("FIN DEL PROCESO DE ENVIO");
  console.log(response);
  console.log("OTRO PROCESO");

  return response;
};

export const retrivelQaDoc = async (question: string) => {
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
  });

  const retriever = vectorStore.asRetriever({
    k: 5,
  });
  
  const prompt = await pull<ChatPromptTemplate>("rlm/rag-prompt");
  const llm = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 });

  const ragChain = await createStuffDocumentsChain({
    llm,
    prompt,
    outputParser: new StringOutputParser(),
  });
  
  const retrievedDocs = await retriever.invoke("articulos que hablen sobre horas laborales");
  const response = await ragChain.invoke({
    question: question,
    context: retrievedDocs,
  });

  return response;
};

export default 
retrivelQaDoc
;
