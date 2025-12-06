import { Injectable } from "@nestjs/common";
import { MessageRepository } from "../../repositories/message.repository";
import { MessageEntity } from "../../entities/message.entity";
import { CreateMessageDto } from "../../dto/create-message.dto";
import { MessageRepositoryPort } from "../../domain/ports/message.repository.port";

@Injectable()
export class MessageRepositoryAdapter implements MessageRepositoryPort {
  constructor(private readonly messageRepository: MessageRepository) {}

  async findByChatId(chatId: string): Promise<MessageEntity[]> {
    const messages = await this.messageRepository.findByChatId(chatId);
    return messages.map((msg) => MessageEntity.create(msg));
  }

  async search(chatId: string, query: string): Promise<MessageEntity[]> {
    const messages = await this.messageRepository.search(chatId, query);
    return messages.map((msg) => MessageEntity.create(msg));
  }

  async create(data: CreateMessageDto & { chat_id: string }): Promise<MessageEntity> {
    const message = await this.messageRepository.create({
      chat_id: data.chat_id,
      content: data.content,
      messageType: data.messageType,
      pdf_url: data.pdf_url || null,
    } as any);
    return MessageEntity.create(message);
  }

  async update(id: string, data: Partial<CreateMessageDto>): Promise<MessageEntity> {
    const message = await this.messageRepository.update(
      { id },
      data as any
    );
    return MessageEntity.create(message);
  }
}

