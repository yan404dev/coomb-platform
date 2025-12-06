import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { ChatRepositoryPort } from "../domain/ports/chat.repository.port";
import { CreateChatUseCase } from "../use-cases/create-chat.use-case";
import { GetChatUseCase } from "../use-cases/get-chat.use-case";
import { ChatEntity } from "../entities/chat.entity";
import { CreateChatDto } from "../dto/create-chat.dto";
import { UpdateChatTitleDto } from "../dto/update-chat-title.dto";
import { Inject } from "@nestjs/common";

@Injectable()
export class ChatService {
  constructor(
    private readonly createChatUseCase: CreateChatUseCase,
    private readonly getChatUseCase: GetChatUseCase,
    @Inject("CHAT_REPOSITORY_PORT")
    private readonly repository: ChatRepositoryPort
  ) {}

  async create(createChatDto: CreateChatDto, userId: string | null): Promise<ChatEntity> {
    return this.createChatUseCase.execute({ userId, data: createChatDto });
  }

  async findAll(userId: string): Promise<Array<{ id: string; title: string; lastMessage: string | null }>> {
    return this.repository.findByUserId(userId);
  }

  async findById(chatId: string, userId: string | null): Promise<ChatEntity> {
    return this.getChatUseCase.execute({ chatId, userId });
  }

  async updateTitle(chatId: string, updateDto: UpdateChatTitleDto, userId: string): Promise<ChatEntity> {
    const chat = await this.repository.findById(chatId);
    if (!chat) {
      throw new NotFoundException("Conversa não encontrada");
    }

    if (chat.user_id !== userId) {
      throw new ForbiddenException("Acesso negado a esta conversa");
    }

    return this.repository.updateTitle(chatId, updateDto);
  }

  async delete(chatId: string, userId: string): Promise<void> {
    const chat = await this.repository.findById(chatId);
    if (!chat) {
      throw new NotFoundException("Conversa não encontrada");
    }

    if (chat.user_id !== userId) {
      throw new ForbiddenException("Acesso negado a esta conversa");
    }

    await this.repository.delete(chatId);
  }
}

