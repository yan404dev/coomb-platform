import { useCallback, useEffect, useMemo } from "react";
import { mutate } from "swr";
import { useAIChat } from "@/app/dashboard/_hooks/use-ai-chat";
import { useChats, CHATS_KEY } from "@/app/dashboard/_hooks/use-chats";
import { useUser } from "@/shared/hooks/use-user";
import { useAnonymousSession } from "@/shared/hooks/use-anonymous-session";
import { getFirstName } from "@/shared/lib/user-utils";

export interface UseDashboardModelProps {
  currentChatId: string | null;
  setCurrentChatId: (chatId: string | null) => void;
}

export function useDashboardModel({
  currentChatId,
  setCurrentChatId,
}: UseDashboardModelProps) {
  const { user } = useUser();
  const { sessionId } = useAnonymousSession();
  const { createNewChat } = useChats({ enabled: Boolean(user) });

  const {
    messages,
    sendMessage,
    uploadResume,
    resetSession,
    optimizeResume,
    isLoading,
    isMutating,
    error,
    chatId: currentChatIdFromHook,
  } = useAIChat(currentChatId, sessionId);

  useEffect(() => {
    if (currentChatIdFromHook && currentChatIdFromHook !== currentChatId) {
      setCurrentChatId(currentChatIdFromHook);
    }
  }, [currentChatIdFromHook, currentChatId, setCurrentChatId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (currentChatId) {
        sessionStorage.setItem("currentChatId", currentChatId);
      } else {
        sessionStorage.removeItem("currentChatId");
      }
    } catch {}
  }, [currentChatId]);

  const firstName = useMemo(() => {
    return getFirstName(user?.fullName);
  }, [user?.fullName]);

  const handleSend = useCallback(
    async (message: string, file?: File | null) => {
      if (file) {
        const jobDescription = message.trim() || undefined;
        const returnedChatId = await uploadResume(file, jobDescription);
        if (returnedChatId) {
          setCurrentChatId(returnedChatId);
          await mutate(CHATS_KEY);
        }
        return;
      }

      if (message.trim()) {
        const returnedChatId = await sendMessage(message.trim());
        if (returnedChatId) {
          setCurrentChatId(returnedChatId);
          await mutate(CHATS_KEY);
        }
      }
    },
    [sendMessage, uploadResume, setCurrentChatId]
  );

  const handleReset = useCallback(async () => {
    await resetSession();
  }, [resetSession]);

  const handleNewConversation = useCallback(async () => {
    setCurrentChatId(null);

    if (user) {
      const chat = await createNewChat().catch(() => null);
      if (chat?.id) {
        setCurrentChatId(chat.id);
        await mutate(CHATS_KEY);
      }
    }
  }, [user, createNewChat, setCurrentChatId]);

  const handleSuggestionSelect = useCallback((prompt: string) => {
    return prompt;
  }, []);

  const handleOptimizeResume = useCallback(
    async (jobDescription: string) => {
      await optimizeResume(jobDescription);
    },
    [optimizeResume]
  );

  return {
    messages,
    isLoading,
    isPending: isMutating,
    error: error ? String(error) : null,
    firstName,
    handleSend,
    handleReset,
    handleNewConversation,
    handleSuggestionSelect,
    handleOptimizeResume,
  };
}
