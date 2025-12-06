import { api } from "@/shared/lib/api";
import type {
  Chat,
  CreateChatDto,
  UpdateChatTitleDto,
} from "@/shared/types/chat.types";

const baseURL = "/api/v1/chats";

export const chatService = {
  /**
   * Criar uma nova conversa
   */
  create: async (dto: CreateChatDto = {}): Promise<Chat> => {
    const response = await api.post<Chat>(baseURL, dto);
    return response.data;
  },

  /**
   * Listar todas as conversas do usuário
   */
  list: async (): Promise<Chat[]> => {
    const response = await api.get<Chat[]>(baseURL);
    return response.data;
  },

  /**
   * Buscar uma conversa por ID
   */
  get: async (chatId: string): Promise<Chat> => {
    const response = await api.get<Chat>(`${baseURL}/${chatId}`);
    return response.data;
  },

  /**
   * Atualizar título de uma conversa
   */
  updateTitle: async (
    chatId: string,
    dto: UpdateChatTitleDto
  ): Promise<Chat> => {
    const response = await api.patch<Chat>(`${baseURL}/${chatId}/title`, dto);
    return response.data;
  },

  /**
   * Deletar uma conversa
   */
  delete: async (chatId: string): Promise<void> => {
    await api.delete(`${baseURL}/${chatId}`);
  },
};
