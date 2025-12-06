"use client";

import { ChatBubble } from "@/components/chat-bubble/chat-bubble";
import type { ChatMessage } from "@/hooks/use-ai-chat";
import { useOptimizationChatModel } from "./optimization-chat.model";

interface OptimizationChatProps {
  messages: ChatMessage[];
  isPending: boolean;
}

export function OptimizationChat({
  messages,
  isPending,
}: OptimizationChatProps) {
  const { messagesEndRef } = useOptimizationChatModel({
    messages,
    isPending,
  });

  if (messages.length === 0 && !isPending) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      {messages.map((message, index) => {
        const hasContent = message.content && message.content.trim().length > 0;
        const hasAttachment = message.fileAttachment && message.role === "user";
        const isAssistant = message.role === "assistant";

        if (!hasContent && !hasAttachment && !message.isTyping && !message.pdfUrl) {
          return null;
        }

        return (
          <div
            key={`${message.id || message.timestamp}-${index}`}
            className="flex flex-col gap-2"
          >
            {hasAttachment && (
              <div className="flex justify-end">
                <div className="max-w-[75%]">
                  <ChatBubble
                    content=""
                    timestamp={message.timestamp}
                    isUser={true}
                    fileAttachment={message.fileAttachment}
                    hideTimestamp={!!hasContent}
                  />
                </div>
              </div>
            )}
            {(hasContent || isAssistant || message.isTyping || message.pdfUrl) && (
              <ChatBubble
                content={message.content}
                timestamp={message.timestamp}
                isUser={message.role === "user"}
                isStreaming={message.isTyping}
                pdfUrl={message.pdfUrl}
                citations={message.citations}
              />
            )}
          </div>
        );
      })}

      <div ref={messagesEndRef} />
    </div>
  );
}
