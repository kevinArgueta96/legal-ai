import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { create } from "domain";

let pineconeClientInstance: PineconeClient | null = null;

//This is how you can create an index in Pinecone
const pinecone = new PineconeClient();

async function createIndex() {
  try {
    await pinecone.createIndex({
      name: process.env.PINECONE_INDEX!,
      dimension: 1536,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
      deletionProtection: "disabled",
    });
  } catch (error) {
    console.error("Error to create a new index in Pinecone", error);
  }
}

async function initPineconeClient() {
  try {
    const pineconeClient = pinecone;
    const existingIndexes = await pineconeClient.listIndexes();
    const pineconeIndex = process.env.PINECONE_INDEX!;

    if (existingIndexes.indexes && existingIndexes.indexes.length > 0) {
      // Verificar si el índice existe en la lista
      const indexExists = existingIndexes.indexes.some(index => index.name === pineconeIndex);
      console.log(indexExists);
      if (!indexExists) {
        await createIndex();
        console.log(`El índice '${pineconeIndex}' fue creado en Pinecone.`);
      } else {
        console.log(`El índice '${pineconeIndex}' se encontró en Pinecone.`);
      }
    } else {
      console.log(`Creando pinecone index`);
      await createIndex();
    }
    
    return pineconeClient;
  } catch (error) {
    console.error("Error to create a new instance of PineconeClient", error);
    throw new Error("Failed to initialize Pinecone Client");
  }
}

export async function getPineconeClient() {
  if (!pineconeClientInstance) {
    pineconeClientInstance = await initPineconeClient();
  }
  return pineconeClientInstance;
}