"use client";

import { useRef, useState, useEffect } from "react";
import { Send, XCircle } from "lucide-react";
import { useChat } from "ai/react";
import { Message } from "ai";
import { ChatMessageBubble } from "./chat-message-bubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function ChatWindow(props: { 
  endpoint: string,
  titleText?: string
}) {
  const [sourcesForMessages, setSourcesForMessages] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);
  const { endpoint } = props;
  const { messages, input, handleInputChange, handleSubmit } = 
  useChat({
    api: endpoint,
    onResponse(response) {
      setError(null);
      const sourcesHeader = response.headers.get("x-sources");
      const sources = sourcesHeader ? JSON.parse(Buffer.from(sourcesHeader, "base64").toString('utf8')) : [];
      const messageIndexHeader = response.headers.get("x-message-index");
      if (sources.length && messageIndexHeader !== null) {
        setSourcesForMessages({...sourcesForMessages, [messageIndexHeader]: sources});
      }
    },
    streamMode: "text",
    onError: (e) => {
      setError("Lo sentimos, ha ocurrido un error al procesar tu mensaje.");
      setTimeout(() => setError(null), 5000);
    }
  });

  const inputLength = input.trim().length;
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isBottom = scrollHeight - scrollTop <= clientHeight + 10;
    setIsScrolledToBottom(isBottom);
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isScrolledToBottom) {
      scrollToBottom();
    }
  }, [messages, isScrolledToBottom]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
    setTimeout(scrollToBottom, 100);
  };

  return (
    <Card className="flex flex-col h-full">
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-destructive/15 text-destructive rounded-lg px-4 py-2 flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <div 
          ref={scrollAreaRef}
          onScroll={handleScroll}
          className="h-full overflow-auto px-4 pt-4"
        >
          {messages.map((message: Message, index) => (
            <ChatMessageBubble
              key={message.id}
              message={message}
              sources={sourcesForMessages[index]}
            />
          ))}
        </div>
      </div>

      <div className="p-4 border-t">
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <Input
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={handleInputChange}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={inputLength === 0}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar mensaje</span>
          </Button>
        </form>
      </div>
    </Card>
  );
}
