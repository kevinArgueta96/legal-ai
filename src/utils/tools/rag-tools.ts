import { tool } from "@langchain/core/tools";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { PineconeStore } from "@langchain/pinecone";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX!;

export const obtainRagInformation = tool(
    async ({ input }: { input: string }) => {

        try {

            console.log(input)

            const prompt = PromptTemplate.fromTemplate(`You are a professional expert in Guatemalan law. 
        Based on the question {input} and the context {context},
         you must generate a clear and precise response derived from the provided information.
          The goal is to produce a specific answer that will be used by another AI agent to
           address the user's query. Ensure that the delivered information directly addresses
            the user's input.`)

            const pinecone = new PineconeClient();

            const embeddings = new OpenAIEmbeddings();
            const index = pinecone.Index(PINECONE_INDEX_NAME);

            const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
                pineconeIndex: index,
                textKey: 'text',
            });

            const llm = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 });


            const retriever = vectorStore.asRetriever({
                k: 5,
            });

            const ragChain = await createStuffDocumentsChain({
                llm,
                prompt,
                outputParser: new StringOutputParser(),
            });

            const retrievedDocs = await retriever.invoke(input);

            const response = await ragChain.invoke({
                input: input,
                context: retrievedDocs
            });

            return response;
        } catch (error) {
            console.log(error)
        }
    },
    {
        name: "obtainRagInformation",
        description: "Retrieve the most relevant information to provide context about Guatemalan laws and effectively answer the user's query. This tool can only be invoked a maximum of three times.",
        schema: z.object({
            input: z.string().describe("The question to obtain information")
        }),
    }
);