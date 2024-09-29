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
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardsChat } from "@/components/chat/chat";

export function ChatLayout() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "api/langchain-pinecone",
    onError: (e) => {
      console.error(e);
      alert("There was an error executing the chatbot.");
    },
  });

  const inputLength = input.trim().length;
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const lastMessageRef = React.useRef<HTMLDivElement>(null);
  const [newMessageCount, setNewMessageCount] = React.useState(0);

  React.useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setNewMessageCount((prevCount) => prevCount + 1);
  }, [messages]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setNewMessageCount(0);
    }, 2000);

    return () => clearTimeout(timer);
  }, [newMessageCount]);

  return (
    <div className="flex flex-col h-screen">
      <CardsChat />
    </div>
  );
}
