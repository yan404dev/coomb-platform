import { MessageEntity } from "../../entities/message.entity";
import { CreateMessageDto } from "../../dto/create-message.dto";

export interface MessageRepositoryPort {
  findByChatId(chatId: string): Promise<MessageEntity[]>;
  search(chatId: string, query: string): Promise<MessageEntity[]>;
  create(data: CreateMessageDto & { chat_id: string }): Promise<MessageEntity>;
  update(id: string, data: Partial<CreateMessageDto>): Promise<MessageEntity>;
}

