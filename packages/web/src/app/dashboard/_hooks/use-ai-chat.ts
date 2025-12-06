import { useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { messageService } from "@/app/dashboard/_services/message.service";
import {
  messageToChatMessage,
  type Message,
  MessageType,
} from "@/shared/types/message.types";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id?: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  pdfUrl?: string;
  isTyping?: boolean;
  isOptimistic?: boolean;
  citations?: Array<{ url: string }>;
  fileAttachment?: {
    name: string;
    size: number;
    type: string;
  };
}

const MESSAGES_KEY = (chatId: string) => `/api/v1/chats/${chatId}/messages`;

const fetchMessages = async (chatId: string | null): Promise<Message[]> => {
  if (!chatId) return [];
  return await messageService.list(chatId);
};

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (error instanceof Error && "status" in error) {
        const status = (error as any).status;
        if (status >= 400 && status < 500) {
          throw error;
        }
      }

      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

export function useAIChat(chatId: string | null, sessionId?: string | null) {
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [messageError, setMessageError] = useState<Error | null>(null);
  const [streamingMessage, setStreamingMessage] = useState<ChatMessage | null>(
    null
  );
  const [optimisticUserMessage, setOptimisticUserMessage] =
    useState<ChatMessage | null>(null);

  const {
    data: messages,
    error: sessionError,
    isLoading,
    mutate,
  } = useSWR(
    chatId ? MESSAGES_KEY(chatId) : null,
    () => fetchMessages(chatId),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      dedupingInterval: 2000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  useEffect(() => {
    setOptimisticUserMessage(null);
    setStreamingMessage(null);
  }, [chatId]);

  const sendMessage = useCallback(
    async (message: string) => {
      const trimmed = message.trim();
      if (!trimmed) return;

      setOptimisticUserMessage(null);
      setStreamingMessage(null);
      setIsSending(true);
      setMessageError(null);

      const currentMessages = messages?.map(messageToChatMessage) ?? [];
      const userTimestamp = new Date().toISOString();

      const optimisticUserMessage: ChatMessage = {
        id: `optimistic-user-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: userTimestamp,
      };

      mutate(
        [...currentMessages, optimisticUserMessage].map((msg) => ({
          id: msg.id || "",
          chat_id: chatId || "",
          messageType:
            msg.role === "user" ? MessageType.USER : MessageType.ASSISTANT,
          content: msg.content,
          pdf_url: msg.pdfUrl || null,
          created_at: msg.timestamp,
        })) as Message[],
        false
      );

      try {
        let content = "";
        let resultChatId = chatId || null;
        let citations: Array<{ url: string }> | undefined;
        const assistantTimestamp = new Date().toISOString();

        for await (const data of messageService.createWithStream(chatId, {
          content: trimmed,
          messageType: MessageType.USER,
        })) {
          resultChatId = data.chatId;

          if (data.isComplete) {
            if (data.citations) {
              citations = data.citations;
              setStreamingMessage({
                id: data.messageId,
                role: "assistant",
                content,
                timestamp: assistantTimestamp,
                isTyping: false,
                citations,
              });
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
            if (data.chatId) {
              await mutate(await fetchMessages(data.chatId));
            }
            setStreamingMessage(null);
            break;
          }

          content += data.chunk;
          setStreamingMessage({
            id: data.messageId,
            role: "assistant",
            content,
            timestamp: assistantTimestamp,
            isTyping: true,
            citations,
          });
        }

        return resultChatId;
      } catch (error) {
        setStreamingMessage(null);
        mutate(messages, false);
        setMessageError(
          error instanceof Error ? error : new Error("Unknown error")
        );
        throw error;
      } finally {
        setIsSending(false);
      }
    },
    [chatId, messages, mutate]
  );

  const uploadResume = useCallback(
    async (file: File, jobDescription?: string) => {
      const now = new Date().toISOString();

      const userMessage: ChatMessage = {
        id: `optimistic-user-${Date.now()}`,
        role: "user",
        content: jobDescription?.trim() || "",
        timestamp: now,
        isOptimistic: true,
        fileAttachment: {
          name: file.name,
          size: file.size,
          type: file.type,
        },
      };

      setOptimisticUserMessage(userMessage);

      setStreamingMessage({
        id: `streaming-${Date.now()}`,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
        isTyping: true,
      });

      setIsSending(true);
      setMessageError(null);

      try {
        const result = await retryWithBackoff(
          () =>
            messageService.uploadResume(
              chatId || null,
              file,
              jobDescription?.trim(),
              sessionId || undefined
            ),
          3
        );

        const currentChatId = result.chatId || chatId;

        if (currentChatId) {
          await mutate(await fetchMessages(currentChatId));
        }

        setOptimisticUserMessage(null);
        setStreamingMessage(null);

        return currentChatId;
      } catch (error) {
        setOptimisticUserMessage(null);
        setStreamingMessage(null);
        mutate(messages, false);
        setMessageError(
          error instanceof Error ? error : new Error("Unknown error")
        );
        throw error;
      } finally {
        setIsSending(false);
      }
    },
    [chatId, messages, mutate, sessionId]
  );

  const optimizeResume = useCallback(
    async (jobDescription: string) => {
      const result = await messageService.create(chatId || null, {
        content: jobDescription,
        messageType: MessageType.USER,
      });

      const currentChatId = result.chatId || chatId;

      if (currentChatId) {
        await mutate(await fetchMessages(currentChatId));
      }

      return currentChatId;
    },
    [chatId, mutate]
  );

  const resetSession = useCallback(async () => {
    setOptimisticUserMessage(null);
    setStreamingMessage(null);
    await mutate([]);
  }, [mutate]);

  const cancelRequest = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }, []);

  const chatMessages: ChatMessage[] = messages?.map(messageToChatMessage) ?? [];

  const messagesWithOptimistic = optimisticUserMessage
    ? [...chatMessages, optimisticUserMessage]
    : chatMessages;

  const allMessages = streamingMessage
    ? messagesWithOptimistic.some((m) => m.id === streamingMessage.id)
      ? messagesWithOptimistic
      : [...messagesWithOptimistic, streamingMessage]
    : messagesWithOptimistic;

  const combinedError = sessionError || messageError;

  return {
    messages: allMessages,
    sendMessage,
    uploadResume,
    optimizeResume,
    resetSession,
    cancelRequest,
    isLoading,
    isMutating: isSending,
    error: combinedError instanceof Error ? combinedError.message : null,
    chatId: chatId || undefined,
  };
}
