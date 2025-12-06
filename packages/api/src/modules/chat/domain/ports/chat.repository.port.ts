import { Chat } from "@prisma/client";
import { CreateChatDto } from "../../dto/create-chat.dto";
import { UpdateChatTitleDto } from "../../dto/update-chat-title.dto";

export interface ChatRepositoryPort {
  findByUserId(userId: string): Promise<Array<{ id: string; title: string; lastMessage: string | null }>>;
  findById(id: string): Promise<Chat | null>;
  create(userId: string | null, data: CreateChatDto): Promise<Chat>;
  updateTitle(chatId: string, data: UpdateChatTitleDto): Promise<Chat>;
  updateMetadata(chatId: string): Promise<void>;
  delete(chatId: string): Promise<void>;
}

