import { Module } from "@nestjs/common";
import { ChatController } from "./controllers/chat.controller";
import { SessionController } from "./controllers/session.controller";
import { ChatService } from "./application/services/chat.service";
import { MessageService } from "./application/services/message.service";
import { SessionService } from "./services/session.service";
import { ChatRepository } from "./repositories/chat.repository";
import { MessageRepository } from "./repositories/message.repository";
import { SessionRepository } from "./repositories/session.repository";
import { ChatRepositoryAdapter } from "./infrastructure/adapters/chat.repository.adapter";
import { MessageRepositoryAdapter } from "./infrastructure/adapters/message.repository.adapter";
import { CreateChatUseCase } from "./application/use-cases/create-chat.use-case";
import { GetChatUseCase } from "./application/use-cases/get-chat.use-case";
import { CreateMessageUseCase } from "./application/use-cases/create-message.use-case";
import { PrismaModule } from "../../common/prisma/prisma.module";
import { AIModule } from "../ai/ai.module";
import { ResumeModule } from "../resume/resume.module";
import { UserModule } from "../user/user.module";
import { INJECTION_TOKENS } from "../../common/constants/injection-tokens";

@Module({
  imports: [PrismaModule, AIModule, ResumeModule, UserModule],
  controllers: [ChatController, SessionController],
  providers: [
    ChatService,
    MessageService,
    SessionService,
    ChatRepository,
    MessageRepository,
    SessionRepository,
    ChatRepositoryAdapter,
    MessageRepositoryAdapter,
    CreateChatUseCase,
    GetChatUseCase,
    CreateMessageUseCase,
    {
      provide: INJECTION_TOKENS.CHAT_REPOSITORY_PORT,
      useClass: ChatRepositoryAdapter,
    },
    {
      provide: INJECTION_TOKENS.MESSAGE_REPOSITORY_PORT,
      useClass: MessageRepositoryAdapter,
    },
  ],
  exports: [
    ChatService,
    MessageService,
    SessionService,
    INJECTION_TOKENS.CHAT_REPOSITORY_PORT,
    INJECTION_TOKENS.MESSAGE_REPOSITORY_PORT,
  ],
})
export class ChatModule {}
