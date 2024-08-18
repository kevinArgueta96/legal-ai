"use client";

import * as React from "react";
import { Send } from "lucide-react";
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

export function CardsChat() {

  const test = async () => {
    console.log("Start send integration Pinecone");
    try {
      const response = await fetch('/api/pinecone');
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log(data.vectorStore);
    } catch (error) {
      console.error(error);
      alert("There was an error fetching the data.");
    }
  }

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: 'api/langchain-pinecone',
    onError: (e) =>{
      console.error(e)
      alert("There was an error executing the chatbot.")
    }
  });

  const inputLength = input.trim().length;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center">
          
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.map((m) => (  
              <div key={m.id} 
                className={cn(
                  "flex flex-col max-w-[75%] rounded-lg px-3 py-2 text-sm stretch",
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}>
                {m.role === "user" ? "User: " : "AI: "}
                {m.content}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
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
      <Button onClick={test}>Enviar</Button>
    </>
  );
}
