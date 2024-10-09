import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0.5,
});

export const generateQuery = async (query: string) => {
    console.log("Query:", query);
    const response = await llm.invoke(query);

    return response;
}