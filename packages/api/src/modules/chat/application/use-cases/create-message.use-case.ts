import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { Message } from "@prisma/client";
import { MessageRepositoryPort } from "../../domain/ports/message.repository.port";
import { ChatRepositoryPort } from "../../domain/ports/chat.repository.port";
import { CreateMessageDto } from "../../dto/create-message.dto";
import { INJECTION_TOKENS } from "../../../../common/constants/injection-tokens";

export interface CreateMessageRequest {
  chatId: string | null | undefined;
  data: CreateMessageDto;
  userId: string | null;
}

@Injectable()
export class CreateMessageUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.MESSAGE_REPOSITORY_PORT)
    private readonly messageRepository: MessageRepositoryPort,
    @Inject(INJECTION_TOKENS.CHAT_REPOSITORY_PORT)
    private readonly chatRepository: ChatRepositoryPort
  ) {}

  async execute(
    request: CreateMessageRequest
  ): Promise<{ message: Message; chatId: string }> {
    const currentChatId = await this.resolveOrCreateChat(
      request.chatId,
      request.userId
    );
    await this.validateChatAccess(currentChatId, request.userId);

    const message = await this.messageRepository.create({
      ...request.data,
      chat_id: currentChatId,
    });

    return {
      message,
      chatId: currentChatId,
    };
  }

  private async resolveOrCreateChat(
    chatId: string | null | undefined,
    userId: string | null
  ): Promise<string> {
    if (!chatId) {
      const newChat = await this.chatRepository.create(userId, {});
      return newChat.id;
    }

    const chat = await this.chatRepository.findById(chatId);
    const shouldCreateNewChat =
      !chat ||
      (userId && chat.user_id !== userId) ||
      (!userId && chat.user_id !== null);

    if (shouldCreateNewChat) {
      const newChat = await this.chatRepository.create(userId, {});
      return newChat.id;
    }

    return chatId;
  }

  private async validateChatAccess(
    chatId: string,
    userId: string | null
  ): Promise<void> {
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) throw new NotFoundException("Conversa não encontrada");
    if (userId && chat.user_id !== userId)
      throw new ForbiddenException("Acesso negado");
    if (!userId && chat.user_id !== null)
      throw new ForbiddenException("Acesso negado");
  }
}
