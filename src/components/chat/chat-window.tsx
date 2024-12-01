"use client";

import * as React from "react";
import { Send, User, Bot } from "lucide-react";
import { useChat } from "ai/react";
import { Message } from "ai";

export function ChatWindow({ endpoint }: { endpoint: string }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: endpoint,
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
    const isBottom = scrollHeight - scrollTop <= clientHeight + 10;
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
    e.preventDefault();
    handleSubmit(e);
    setTimeout(scrollToBottom, 100);
  };

  return (
    <div className="w-full max-w-2xl h-full flex flex-col bg-white rounded-lg shadow-lg">
      <div className="flex flex-row items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Chat with AI</h2>
      </div>
      <div className="flex-grow p-0 overflow-hidden relative">
        <div 
          className="h-full overflow-auto" 
          ref={scrollAreaRef}
          onScroll={handleScroll}
        >
          <div className="space-y-4 p-4">
            {messages.map((m: Message, index) => (
              <div
                key={m.id}
                className={`flex items-start space-x-2 transition-all duration-300 ease-in-out ${
                  m.role === "user" ? "justify-end" : "justify-start"
                } ${index === 0 ? "pt-8" : ""}`}
                style={{
                  opacity: `${Math.min(1, (index + 1) / 3)}`,
                }}
              >
                {m.role !== "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Bot size={24} />
                  </div>
                )}
                <div
                  className={`flex flex-col space-y-2 max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  <span className="font-semibold">
                    {m.role === "user" ? "You" : "AI"}
                  </span>
                  <p>{m.content}</p>
                </div>
                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div 
          className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent pointer-events-none"
          style={{
            opacity: isScrolledToBottom ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      </div>
      <div className="p-4 border-t">
        <form
          onSubmit={handleFormSubmit}
          className="flex w-full items-center space-x-2"
        >
          <input
            type="text"
            id="message"
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="off"
            value={input}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            disabled={inputLength === 0}
            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
