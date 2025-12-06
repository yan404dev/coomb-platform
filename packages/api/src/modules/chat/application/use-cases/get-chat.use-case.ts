import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { Chat } from "@prisma/client";
import { ChatRepositoryPort } from "../../domain/ports/chat.repository.port";
import { INJECTION_TOKENS } from "../../../../common/constants/injection-tokens";

export interface GetChatRequest {
  chatId: string;
  userId: string | null;
}

@Injectable()
export class GetChatUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.CHAT_REPOSITORY_PORT)
    private readonly repository: ChatRepositoryPort
  ) {}

  async execute(request: GetChatRequest): Promise<Chat> {
    const chat = await this.repository.findById(request.chatId);

    if (!chat) {
      throw new NotFoundException("Conversa não encontrada");
    }

    if (request.userId && chat.user_id !== request.userId) {
      throw new ForbiddenException("Acesso negado a esta conversa");
    }

    if (!request.userId && chat.user_id !== null) {
      throw new ForbiddenException("Acesso negado a esta conversa");
    }

    return chat;
  }
}
