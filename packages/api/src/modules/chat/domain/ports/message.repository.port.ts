import { Message } from "@prisma/client";
import { CreateMessageDto } from "../../dto/create-message.dto";

export interface MessageRepositoryPort {
  findByChatId(chatId: string): Promise<Message[]>;
  search(chatId: string, query: string): Promise<Message[]>;
  create(data: CreateMessageDto & { chat_id: string }): Promise<Message>;
  update(id: string, data: Partial<CreateMessageDto>): Promise<Message>;
}

