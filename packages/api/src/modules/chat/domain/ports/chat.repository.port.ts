import { ChatEntity } from "../../entities/chat.entity";
import { CreateChatDto } from "../../dto/create-chat.dto";
import { UpdateChatTitleDto } from "../../dto/update-chat-title.dto";

export interface ChatRepositoryPort {
  findByUserId(userId: string): Promise<Array<{ id: string; title: string; lastMessage: string | null }>>;
  findById(id: string): Promise<ChatEntity | null>;
  create(userId: string | null, data: CreateChatDto): Promise<ChatEntity>;
  updateTitle(chatId: string, data: UpdateChatTitleDto): Promise<ChatEntity>;
  updateMetadata(chatId: string): Promise<void>;
  delete(chatId: string): Promise<void>;
}

