import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
  Optional,
  Logger,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateMessageDto } from "./dtos/create-message.dto";
import { CoombAIClientPort } from "../ai/ai.types";
import { ChatMessage } from "../ai/entities/ai.entity";
import { INJECTION_TOKENS } from "../../common/constants/injection-tokens";

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Optional()
    @Inject(INJECTION_TOKENS.COOMB_AI_CLIENT_PORT)
    private readonly coombAI?: CoombAIClientPort
  ) { }

  async create(
    chatId: string | null | undefined,
    createMessageDto: CreateMessageDto,
    userId: string | null
  ) {
    let currentChatId = this.normalizeChatId(chatId);

    if (!currentChatId) {
      const chat = await this.prisma.chat.create({
        data: { user_id: userId, title: "Nova Conversa" },
      });
      currentChatId = chat.id;
    } else {
      await this.validateChatAccess(currentChatId, userId);
    }

    const userMessage = await this.prisma.message.create({
      data: {
        chat_id: currentChatId,
        role: "USER",
        messageType: "TEXT",
        content: createMessageDto.content,
        pdf_url: createMessageDto.pdf_url,
      },
    });

    if (createMessageDto.content && createMessageDto.content.trim()) {
      await this.generateAssistantResponse(currentChatId, userId);
    }

    await this.updateChatMetadata(currentChatId);

    return { message: userMessage, chatId: currentChatId };
  }

  async findByChatId(chatId: string, userId: string | null) {
    await this.validateChatAccess(chatId, userId);

    return this.prisma.message.findMany({
      where: { chat_id: chatId },
      orderBy: { created_at: "asc" },
    });
  }

  async uploadResume(
    chatId: string | null | undefined,
    file: Express.Multer.File | undefined,
    fileName: string | undefined,
    jobDescription: string | undefined,
    userId: string | null
  ) {
    if (!file && !fileName) {
      throw new BadRequestException("Arquivo ou nome do arquivo é obrigatório");
    }

    const actualFileName = file?.originalname || fileName || "arquivo.pdf";
    let currentChatId = this.normalizeChatId(chatId);

    if (!currentChatId) {
      const chat = await this.prisma.chat.create({
        data: { user_id: userId, title: "Nova Conversa" },
      });
      currentChatId = chat.id;
    } else {
      await this.validateChatAccess(currentChatId, userId);
    }

    let extractedText = "";
    if (file && this.coombAI) {
      try {
        extractedText = await this.coombAI.extractText(file.buffer, actualFileName);
      } catch (error) {
        this.logger.error("Erro ao extrair texto:", error);
      }
    }

    const userContent = jobDescription || "Analise meu currículo";

    await this.prisma.message.create({
      data: {
        chat_id: currentChatId,
        role: "USER",
        messageType: "PDF_ATTACHMENT",
        content: userContent,
      },
    });

    await this.generateAssistantResponse(currentChatId, userId);
    await this.updateChatMetadata(currentChatId);

    return {
      chatId: currentChatId,
      data: extractedText ? { raw_text: extractedText } : null,
    };
  }

  private async validateChatAccess(chatId: string, userId: string | null) {
    const chat = await this.prisma.chat.findUnique({ where: { id: chatId } });

    if (!chat || chat.deleted_at) {
      throw new NotFoundException("Chat não encontrado");
    }

    if (userId && chat.user_id !== userId) {
      throw new ForbiddenException("Acesso negado");
    }

    if (!userId && chat.user_id !== null) {
      throw new ForbiddenException("Acesso negado");
    }
  }

  private async generateAssistantResponse(chatId: string, userId: string | null) {
    if (!this.coombAI) return;

    const messages = await this.prisma.message.findMany({
      where: { chat_id: chatId },
      orderBy: { created_at: "asc" },
    });

    const chatMessages: ChatMessage[] = messages.map((msg) => ({
      role: (msg.role === "USER" ? "user" : "assistant") as "user" | "assistant",
      content: msg.content,
    }));

    const response = await this.coombAI.chatCompletion(chatMessages, userId);

    const pdfUrl = response.pdf_url
      ? `${process.env.COOMB_AI_URL || "http://localhost:8000"}${response.pdf_url}`
      : undefined;

    await this.prisma.message.create({
      data: {
        chat_id: chatId,
        role: "ASSISTANT",
        messageType: "TEXT",
        content: response.content,
        pdf_url: pdfUrl,
      },
    });

    await this.updateChatMetadata(chatId);
  }

  private async updateChatMetadata(chatId: string) {
    const count = await this.prisma.message.count({ where: { chat_id: chatId } });

    await this.prisma.chat.update({
      where: { id: chatId },
      data: {
        message_count: count,
        last_message_at: new Date(),
      },
    });
  }

  private normalizeChatId(chatId: string | null | undefined): string | null {
    if (!chatId || chatId === "new") {
      return null;
    }
    return chatId;
  }
}
