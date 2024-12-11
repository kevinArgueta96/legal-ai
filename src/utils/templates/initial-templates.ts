import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";

//FOR THE AGENT:
import { StateGraph, Annotation } from "@langchain/langgraph";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

export const validatePrompt = async (input: string) => {
  const prompt = ChatPromptTemplate.fromTemplate(
    "Said something particular about this word {input}"
  );
  return await prompt.format({ input: input });
};

export const createTestChain = async (input: string) => {
  //const prompt = ChatPromptTemplate.fromTemplate('Said something particular about this word {input}');
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "Said something particular about this word"],
    ["human", "{input}"],
  ]);
  const llm = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0.5,
  });
  const parser = new StringOutputParser();

  const chain = prompt.pipe(llm).pipe(parser);
  const invoke = await chain.invoke({
    input,
  });

  return invoke;
};

export const structuredParser = async (category: string) => {
  const llm = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0.5,
  });

  const initialPrompt = ChatPromptTemplate.fromTemplate(
    "Create and ficticial product using the category of the word {word}, its necesarry to include the name, price and description of the product"
  );

  const analysisPrompt =
    ChatPromptTemplate.fromTemplate(`Obtain the information of name, age and city of the person in the history
        Formatting Instructions: {format_instructions} return the data only in spanish language never other
          {history}
          `);

  const initialChain = initialPrompt.pipe(llm).pipe(new StringOutputParser());

  const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
    name: "The name of the person",
    price: "The price of the person",
    description: "The description of the person",
  });

  const composedChain = new RunnableLambda({
    func: async (input: { topic: string }) => {
      const response = await initialChain.invoke({ word: input });
      return {
        history: response,
        format_instructions: outputParser.getFormatInstructions(),
      };
    },
  })
    .pipe(analysisPrompt)
    .pipe(llm)
    .pipe(outputParser);

  return await composedChain.invoke({ topic: category });
};