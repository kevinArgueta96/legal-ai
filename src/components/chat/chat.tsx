"use client";

import * as React from "react";
import { Send, User, Bot } from "lucide-react";
import { useChat } from "ai/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function CardsChat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: 'api/langchain-pinecone',
    onError: (e) => {
      console.error(e);
      alert("There was an error executing the chatbot.");
    }
  });

  const inputLength = input.trim().length;
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = React.useState(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isBottom = scrollHeight - scrollTop <= clientHeight + 10; // Added a small threshold
    setIsScrolledToBottom(isBottom);
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  React.useEffect(() => {
    if (isScrolledToBottom) {
      scrollToBottom();
    }
  }, [messages, isScrolledToBottom]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e);
    // Force scroll to bottom on submit
    setTimeout(scrollToBottom, 100);
  };

  return (
    <Card className="w-full max-w-2xl h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Chat with AI</h2>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden relative">
        <ScrollArea 
          className="h-full" 
          ref={scrollAreaRef}
          onScroll={handleScroll}
        >
          <div className="space-y-4 p-4">
            {messages.map((m, index) => (
              <div
                key={m.id}
                className={cn(
                  "flex items-start space-x-2 transition-all duration-300 ease-in-out",
                  m.role === "user" ? "justify-end" : "justify-start",
                  index === 0 ? "pt-8" : ""
                )}
                style={{
                  opacity: `${Math.min(1, (index + 1) / 3)}`,
                }}
              >
                {m.role !== "user" && (
                  <Avatar>
                    <AvatarFallback><Bot size={24} /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "flex flex-col space-y-2 max-w-[75%] rounded-lg px-3 py-2 text-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <span className="font-semibold">
                    {m.role === "user" ? "You" : "AI"}
                  </span>
                  <p>{m.content}</p>
                </div>
                {m.role === "user" && (
                  <Avatar>
                    <AvatarFallback><User size={24} /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div 
          className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background to-transparent pointer-events-none"
          style={{
            opacity: isScrolledToBottom ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      </CardContent>
      <CardFooter className="p-4 border-t">
        <form
          onSubmit={handleFormSubmit}
          className="flex w-full items-center space-x-2"
        >
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            value={input}
            onChange={handleInputChange}
          />
          <Button type="submit" size="icon" disabled={inputLength === 0}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}