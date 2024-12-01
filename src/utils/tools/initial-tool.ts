import { tool } from "@langchain/core/tools";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getExpenses } from "@/lib/supabase/get-sells";

//SCHEMAS
const numberSchema = z.object({
    firstNumber: z.number().describe("The first number to multiply"),
    secondNumber: z.number().describe("The second number to multiply")
})

const randomIntToolSchema = z.object({
    min: z.number(),
    max: z.number(),
    size: z.number(),
  });
  
//TOOLS
export const adderTool = tool(
    async (input): Promise<string> => {
      const sum = input.firstNumber + input.secondNumber;
      return `The sum of ${input.firstNumber} and ${input.secondNumber} is ${sum}`;
    },
    {
      name: "adder",
      description: "Adds two numbers together",
      schema: numberSchema,
    }
  );

export const multiplyTool = tool(
    async (input): Promise<number> => {
        return input.firstNumber * input.secondNumber;
    },
    {
        name: "multiply",
        description: "Multiply two numbers",
        schema: numberSchema
    }
)

export const dynamicTool = new DynamicStructuredTool({
    name: "multiply",
    description: "multiply two numbers together",
    schema: z.object({
      a: z.number().describe("the first number to multiply"),
      b: z.number().describe("the second number to multiply"),
    }),
    func: async ({ a, b }: { a: number; b: number }) => {
      return (a * b).toString();
    },
  });
  
  export const generateRandomInts = tool(
    async ({ min, max, size }) => {
      const array: number[] = [];
      for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * (max - min + 1)) + min);
      }
      return [
        `Successfully generated array of ${size} random ints in [${min}, ${max}].`,
        array,
      ];
    },
    {
      name: "generateRandomInts",
      description: "Generate size random ints in the range [min, max].",
      schema: randomIntToolSchema,
      responseFormat: "content_and_artifact",
    }
  );

  export const obtainPositiveValue = tool(
    async() => {
      return Math.floor(Math.random() * 100) + 1;
    },
    {
      name: 'obtainPositiveValue',
      description: 'Obtain a positive value'
    }
  );

  export const obtainNegativeValue = tool(
    async() => {
      return -Math.floor(Math.random() * 100) - 1;
    },
    {
      name: 'obtainNegativeValue',
      description: 'Obtain a negative value'
    }
  );

  export const obtainExpensesData = tool(
    async() => {
      const response = await getExpenses();
      
      const dataString = JSON.stringify(response);
      return dataString;
    },
    {
      name: 'obtainExpensesData',
      description: 'Obtain the data of the sell products'
    }
  );

  export const obtainUserName = tool (
    async() => {
      return 'John Doe';
    },
    {
      name: 'obtainUserName',
      description: 'Obtain the user name'
    }
  )