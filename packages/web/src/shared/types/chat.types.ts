/**
 * Chat Entity
 * Representa uma conversa no sistema
 */
export interface Chat {
  id: string;
  title: string;
  lastMessage: string | null;
}

export interface CreateChatDto {
  title?: string;
}

export interface UpdateChatTitleDto {
  title: string;
}

