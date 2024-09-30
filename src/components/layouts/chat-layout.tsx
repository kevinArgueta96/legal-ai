"use client";

import * as React from "react";
import { CardsChat } from "@/components/chat/chat";

export function ChatLayout() {
  return (
    <div className="h-full flex items-center justify-center">
      <CardsChat />
    </div>
  );
}