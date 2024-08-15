import { StreamingTextResponse, createStreamDataTransformer } from "ai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    //Export message from the body of the request
    const { messages } = await req.json();
    alert(messages)

    const message = messages.at(-1).content;

    const prompt = PromptTemplate.fromTemplate("{message}");

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
      model: "gpt-3.5-turbo",
      temperature: 0.8,
    });

    const parser = new HttpResponseOutputParser();
    const chain = prompt.pipe(model).pipe(parser);

    const stream = await chain.stream({ message });

    return new StreamingTextResponse(
      stream.pipeThrough(createStreamDataTransformer())
    );
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
