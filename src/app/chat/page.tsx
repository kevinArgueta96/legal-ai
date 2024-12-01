"use client";

import { ChatWindow } from "@/components/chat/chat-window";

export default function ChatPage() {
  return (
    <div className="flex-1 p-4">
      <ChatWindow endpoint="/api/langchain-pinecone" />
    </div>
  );
}
