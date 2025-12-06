import { useCallback } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { messageService } from "@/app/dashboard/_services/message.service";
import type {
  Message,
  CreateMessageDto,
  SearchMessagesDto,
} from "@/shared/types/message.types";
import { messageToChatMessage } from "@/shared/types/message.types";

const MESSAGES_KEY = (chatId: string) => `/api/v1/chats/${chatId}/messages`;

const fetcher = async (chatId: string): Promise<Message[]> => {
  return await messageService.list(chatId);
};

const createMessage = async (
  _: string,
  { arg }: { arg: { chatId: string; dto: CreateMessageDto } }
): Promise<Message> => {
  return await messageService.create(arg.chatId, arg.dto);
};

const searchMessages = async (
  _: string,
  { arg }: { arg: { chatId: string; dto: SearchMessagesDto } }
): Promise<Message[]> => {
  return await messageService.search(arg.chatId, arg.dto);
};

export interface UseMessagesOptions {
  chatId: string;
  enabled?: boolean;
}

export function useMessages({ chatId, enabled = true }: UseMessagesOptions) {
  const shouldFetch = enabled && chatId ? MESSAGES_KEY(chatId) : null;

  const {
    data: messages,
    error,
    isLoading,
    mutate,
  } = useSWR<Message[]>(shouldFetch, () => fetcher(chatId), {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  const {
    trigger: triggerCreate,
    isMutating: isCreating,
  } = useSWRMutation(MESSAGES_KEY(chatId), createMessage);

  const {
    trigger: triggerSearch,
    isMutating: isSearching,
  } = useSWRMutation(MESSAGES_KEY(chatId), searchMessages);

  const create = useCallback(
    async (dto: CreateMessageDto) => {
      if (!enabled || !chatId) {
        return null;
      }

      const message = await triggerCreate({ chatId, dto });
      await mutate();
      return message;
    },
    [enabled, chatId, triggerCreate, mutate]
  );

  const search = useCallback(
    async (query: string) => {
      if (!enabled || !chatId) {
        return [];
      }

      const results = await triggerSearch({ chatId, dto: { query } });
      return results;
    },
    [enabled, chatId, triggerSearch]
  );

  return {
    messages: messages ?? [],
    chatMessages: (messages ?? []).map(messageToChatMessage),
    isLoading: enabled ? isLoading : false,
    isMutating: enabled ? isCreating || isSearching : false,
    error: error instanceof Error ? error.message : null,
    create,
    search,
    mutate,
  };
}

