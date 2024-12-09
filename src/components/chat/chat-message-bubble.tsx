"use client";

import type { Message } from "ai/react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Bot, User } from "lucide-react";

interface ChatMessageBubbleProps {
  message: Message;
  sources?: any[];
}

export function ChatMessageBubble({ message, sources }: ChatMessageBubbleProps) {
  const isUser = message.role === "user";
  
  return (
    <div className={cn(
      "flex items-end mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="flex h-8 w-8 rounded-full bg-gradient-to-r from-violet-500 to-violet-600 items-center justify-center ring-2 ring-violet-500/40 mr-2">
          <Bot className="h-5 w-5 text-white" />
        </div>
      )}
      
      <div className={cn(
        "flex flex-col space-y-2 max-w-[85%] md:max-w-[75%]",
        isUser ? "items-end" : "items-start"
      )}>
        <Card className={cn(
          "px-4 py-3 rounded-2xl shadow-sm",
          isUser ? 
            "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none" : 
            "bg-gray-100 dark:bg-gray-800 rounded-bl-none"
        )}>
          <div className="flex flex-col space-y-2">
            <span className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </span>
          </div>
        </Card>

        {sources && sources.length > 0 && (
          <div className="w-full space-y-2">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
              🔍 Sources
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 text-xs space-y-2">
              {sources.map((source, i) => (
                <div key={`source:${i}`} className="space-y-1">
                  <div className="text-gray-700 dark:text-gray-300">
                    {i + 1}. &quot;{source.pageContent}&quot;
                  </div>
                  {source.metadata?.loc?.lines !== undefined && (
                    <div className="text-gray-500 dark:text-gray-400 text-xs">
                      Lines {source.metadata.loc.lines.from} to {source.metadata.loc.lines.to}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 items-center justify-center ring-2 ring-blue-500/40 ml-2">
          <User className="h-5 w-5 text-white" />
        </div>
      )}
    </div>
  );
}
