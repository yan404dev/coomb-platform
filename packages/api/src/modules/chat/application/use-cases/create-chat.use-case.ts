import { Injectable, Inject } from "@nestjs/common";
import { ChatRepositoryPort } from "../../domain/ports/chat.repository.port";
import { ChatEntity } from "../../entities/chat.entity";
import { CreateChatDto } from "../../dto/create-chat.dto";

export interface CreateChatRequest {
  userId: string | null;
  data: CreateChatDto;
}

@Injectable()
export class CreateChatUseCase {
  constructor(
    @Inject("CHAT_REPOSITORY_PORT")
    private readonly repository: ChatRepositoryPort
  ) {}

  async execute(request: CreateChatRequest): Promise<ChatEntity> {
    return this.repository.create(request.userId, request.data);
  }
}

