import { Injectable, Inject } from "@nestjs/common";
import { Chat } from "@prisma/client";
import { ChatRepositoryPort } from "../../domain/ports/chat.repository.port";
import { CreateChatDto } from "../../dto/create-chat.dto";
import { INJECTION_TOKENS } from "../../../../common/constants/injection-tokens";

export interface CreateChatRequest {
  userId: string | null;
  data: CreateChatDto;
}

@Injectable()
export class CreateChatUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.CHAT_REPOSITORY_PORT)
    private readonly repository: ChatRepositoryPort
  ) {}

  async execute(request: CreateChatRequest): Promise<Chat> {
    return this.repository.create(request.userId, request.data);
  }
}
