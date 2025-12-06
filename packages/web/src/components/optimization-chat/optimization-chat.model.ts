import { useEffect, useRef } from "react";

interface UseOptimizationChatModelProps {
  messages: unknown[];
  isPending: boolean;
}

export function useOptimizationChatModel({
  messages,
  isPending,
}: UseOptimizationChatModelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  return {
    messagesEndRef,
  };
}
