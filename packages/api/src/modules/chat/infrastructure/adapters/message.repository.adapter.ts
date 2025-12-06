import { Injectable } from "@nestjs/common";
import { Message } from "@prisma/client";
import { MessageRepository } from "../../repositories/message.repository";
import { CreateMessageDto } from "../../dto/create-message.dto";
import { MessageRepositoryPort } from "../../domain/ports/message.repository.port";

@Injectable()
export class MessageRepositoryAdapter implements MessageRepositoryPort {
  constructor(private readonly messageRepository: MessageRepository) {}

  async findByChatId(chatId: string): Promise<Message[]> {
    const messages = await this.messageRepository.findByChatId(chatId);
    return messages;
  }

  async search(chatId: string, query: string): Promise<Message[]> {
    const messages = await this.messageRepository.search(chatId, query);
    return messages;
  }

  async create(data: CreateMessageDto & { chat_id: string }): Promise<Message> {
    const message = await this.messageRepository.create({
      chat_id: data.chat_id,
      content: data.content,
      messageType: data.messageType,
      pdf_url: data.pdf_url || null,
    } as any);
    return message;
  }

  async update(id: string, data: Partial<CreateMessageDto>): Promise<Message> {
    const message = await this.messageRepository.update({ id }, data as any);
    return message;
  }
}
