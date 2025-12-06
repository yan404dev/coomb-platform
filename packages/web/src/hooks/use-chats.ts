import { useCallback } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { chatService } from "@/services/chat.service";
import type {
  Chat,
  CreateChatDto,
  UpdateChatTitleDto,
} from "@/entities/chat.entity";

export const CHATS_KEY = "/api/v1/chats";

const fetcher = async (): Promise<Chat[]> => {
  return await chatService.list();
};

const createChat = async (
  _: string,
  { arg }: { arg: CreateChatDto }
): Promise<Chat> => {
  return await chatService.create(arg);
};

const deleteChat = async (_: string, { arg }: { arg: string }) => {
  await chatService.delete(arg);
};

const updateChatTitle = async (
  _: string,
  { arg }: { arg: { chatId: string; dto: UpdateChatTitleDto } }
): Promise<Chat> => {
  return await chatService.updateTitle(arg.chatId, arg.dto);
};

export interface UseChatsOptions {
  enabled?: boolean;
}

export function useChats({ enabled = true }: UseChatsOptions = {}) {
  const shouldFetch = enabled ? CHATS_KEY : null;

  const {
    data: chats,
    error,
    isLoading,
    mutate,
  } = useSWR<Chat[]>(shouldFetch, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  const { trigger: triggerCreate, isMutating: isCreating } = useSWRMutation(
    CHATS_KEY,
    createChat
  );

  const { trigger: triggerDelete, isMutating: isDeleting } = useSWRMutation(
    CHATS_KEY,
    deleteChat
  );

  const { trigger: triggerUpdate, isMutating: isUpdating } = useSWRMutation(
    CHATS_KEY,
    updateChatTitle
  );

  const createNewChat = useCallback(
    async (dto: CreateChatDto = {}) => {
      if (!enabled) {
        return null;
      }
      const newChat = await triggerCreate(dto);
      await mutate();
      return newChat;
    },
    [enabled, triggerCreate, mutate]
  );

  const deleteConversation = useCallback(
    async (chatId: string) => {
      if (!enabled) {
        return;
      }
      await triggerDelete(chatId);
      await mutate();
    },
    [enabled, triggerDelete, mutate]
  );

  const updateConversationTitle = useCallback(
    async (chatId: string, dto: UpdateChatTitleDto) => {
      if (!enabled) {
        return;
      }
      await triggerUpdate({ chatId, dto });
      await mutate();
    },
    [enabled, triggerUpdate, mutate]
  );

  return {
    chats: chats ?? [],
    isLoading: enabled ? isLoading : false,
    isMutating: enabled ? isCreating || isDeleting || isUpdating : false,
    error: error instanceof Error ? error.message : null,
    createNewChat,
    deleteConversation,
    updateConversationTitle,
    mutate,
  };
}
