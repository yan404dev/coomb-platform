import { Module } from "@nestjs/common";
import { PrismaModule } from "../../common/prisma/prisma.module";
import { AIModule } from "../ai/ai.module";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { MessageService } from "./message.service";

@Module({
  imports: [PrismaModule, AIModule],
  controllers: [ChatController],
  providers: [ChatService, MessageService],
  exports: [ChatService, MessageService],
})
export class ChatModule { }
