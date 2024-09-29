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

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Chat with AI</h2>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-4 p-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex items-start space-x-2 transition-all duration-300 ease-in-out",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
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
      </CardContent>
      <CardFooter className="p-4 border-t">
        <form
          onSubmit={handleSubmit}
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