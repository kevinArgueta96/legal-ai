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

           const similarityQueries = PromptTemplate.fromTemplate(`
                You are an expert in retrieving relevant information to answer questions in a search context.

                Your task is to generate **three specific and related queries** based on the following user input to maximize the likelihood of retrieving the most relevant documents.

                **User Input:** {input}

                **Instructions:**
                1. Analyze the input to identify the topic, context, and keywords.
                2. Generate three different but related queries that cover variations in phrasing and context.
                3. Ensure the queries include combinations of both specific and generic keywords.
                `)


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

            const generateSimilarityQueries = await similarityQueries.pipe(llm).pipe(new StringOutputParser()).invoke({input})

            const retrievedDocs = await retriever.invoke(generateSimilarityQueries);

            console.log({retrievedDocs,input,generateSimilarityQueries})

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
            input: z.string().describe("The specific question of the user with the most relevant information for obtain information in vector store")
        }),
    }
);