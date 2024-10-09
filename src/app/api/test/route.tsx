import { ChatOpenAI } from "@langchain/openai";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { multiplyTool,adderTool, dynamicTool, generateRandomInts } from "@/utils/tools/initial-tool";
import { validatePrompt, createTestChain, structuredParser,usingRunnableSequence } from "@/utils/templates/initial-templates";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const multiplyResult = await multiplyTool.invoke({
    firstNumber: 2,
    secondNumber: 3,
  });
  const addResult = await adderTool.invoke({
    firstNumber: 2,
    secondNumber: 3,
    }
  )

  const dynamicResult = await dynamicTool.invoke({a: 2, b: 3});
  const randomInts = await generateRandomInts.invoke({
    name: "generateRandomInts",
    args: { min: 0, max: 9, size: 10 },
    id: "123", // required
    type: "tool_call",
  });

  const promptFormat = await validatePrompt("hello");
  const testChain = await createTestChain("Guatemala");
  const structuredResult = await structuredParser("Audifonos");
  const structuredResult2 = await usingRunnableSequence("Next js");

  console.log({ structuredResult2  });

  return new Response();
  //return await handler(messages);
}

const handler = async (message: string) => {
  //const agentTools = [new TavilySearchResults({ maxResults: 3 })];
  //const agentModel = new ChatOpenAI({ temperature: 0 });
  const parser = new HttpResponseOutputParser();
  const stringParser = new StringOutputParser();

  const llm = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0.5,
  });
  llm.bindTools;
  const model = llm.pipe(stringParser);
  const stream = await model.invoke(message);

  const httpResponse = new Response(stream, {
    headers: { "Content-Type": "application/json" },
  });

  return httpResponse;
};
