import { Injectable } from "@nestjs/common";
import { ChatRepository } from "../../repositories/chat.repository";
import { ChatEntity } from "../../entities/chat.entity";
import { CreateChatDto } from "../../dto/create-chat.dto";
import { UpdateChatTitleDto } from "../../dto/update-chat-title.dto";
import { ChatRepositoryPort } from "../../domain/ports/chat.repository.port";

@Injectable()
export class ChatRepositoryAdapter implements ChatRepositoryPort {
  constructor(private readonly chatRepository: ChatRepository) {}

  async findByUserId(userId: string): Promise<Array<{ id: string; title: string; lastMessage: string | null }>> {
    const chats = await this.chatRepository.findByUserId(userId);
    return chats.map((chat) => ({
      id: chat.id,
      title: chat.title,
      lastMessage: chat.lastMessage || null,
    }));
  }

  async findById(id: string): Promise<ChatEntity | null> {
    const chat = await this.chatRepository.findById(id);
    return chat ? ChatEntity.create(chat) : null;
  }

  async create(userId: string | null, data: CreateChatDto): Promise<ChatEntity> {
    const chat = await this.chatRepository.create({
      user_id: userId,
      title: data.title || "Nova Conversa",
      message_count: 0,
    } as any);
    return ChatEntity.create(chat);
  }

  async updateTitle(chatId: string, data: UpdateChatTitleDto): Promise<ChatEntity> {
    const updated = await this.chatRepository.update(
      { id: chatId },
      { title: data.title }
    );
    return ChatEntity.create(updated);
  }

  async updateMetadata(chatId: string): Promise<void> {
    await this.chatRepository.update(
      { id: chatId },
      {
        message_count: { increment: 1 },
        last_message_at: new Date(),
      } as any
    );
  }

  async delete(chatId: string): Promise<void> {
    await this.chatRepository.delete({ id: chatId });
  }
}

