import { NextResponse, NextRequest } from "next/server";

import { Message as VercelChatMessage, StreamingTextResponse } from "ai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";

import {
  AIMessage,
  ChatMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

import {
  obtainUserName,
} from "@/utils/tools/initial-tool";

import { obtainRagInformation } from "@/utils/tools/rag-tools";

export const dynamic = "force-dynamic";

const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
  if (message.role === "user") {
    return new HumanMessage(message.content);
  } else if (message.role === "assistant") {
    return new AIMessage(message.content);
  } else {
    return new ChatMessage(message.content, message.role);
  }
};

const AGENT_SYSTEM_TEMPLATE = `You are an AI agent specialized in answering questions related to the laws of Guatemala. Your mission is to provide clear, accurate, and Guatemala law-focused answers. For any legal reference, you must obtain article numbers exclusively from the tools at your disposal. If you cannot retrieve this information from the tools, clearly state that the source was not obtained. You will process information from these tools to deliver the best possible response within the context of Guatemalan law. At the end of any message, always include: "Thank you for asking."`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const messages = (body.messages ?? [])
      .filter(
        (message: VercelChatMessage) =>
          message.role === "user" || message.role === "assistant"
      ).map(convertVercelMessageToLangChainMessage);
    
    const tools = [
      obtainUserName,
      obtainRagInformation
    ];

    const chat = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0,
    });

    const agent = createReactAgent({
      llm: chat,
      tools,
      messageModifier: new SystemMessage(AGENT_SYSTEM_TEMPLATE),
    });

    const eventStream = await agent.streamEvents(
      { messages },
      { version: "v2" }
    );

    const textEncoder = new TextEncoder();
    const transformStream = new ReadableStream({
      async start(controller) {
        for await (const { event, data } of eventStream) {
          if (event === "on_chat_model_stream") {
            // Intermediate chat model generations will contain tool calls and no content
            if (!!data.chunk.content) {
              controller.enqueue(textEncoder.encode(data.chunk.content));
            }
          }
        }
        controller.close();
      },
    });

    return new StreamingTextResponse(transformStream);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status ?? 500 }
    );
  }
}
