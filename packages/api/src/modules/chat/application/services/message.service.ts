import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Optional,
  Inject,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { MessageRepositoryPort } from "../domain/ports/message.repository.port";
import { ChatRepositoryPort } from "../domain/ports/chat.repository.port";
import { SearchMessagesDto } from "../dto/search-messages.dto";
import { CreateMessageDto } from "../dto/create-message.dto";
import { MessageEntity } from "../entities/message.entity";
import { ChatAIService } from "../../ai/application/services/chat-ai.service";
import { MessageType } from "../dto/create-message.dto";
import { CoombAIClientPort } from "../../ai/domain/ports/coomb-ai-client.port";
import { SessionService } from "./session.service";
import { CreateMessageUseCase } from "../use-cases/create-message.use-case";

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @Inject("MESSAGE_REPOSITORY_PORT")
    private readonly messageRepository: MessageRepositoryPort,
    @Inject("CHAT_REPOSITORY_PORT")
    private readonly chatRepository: ChatRepositoryPort,
    private readonly createMessageUseCase: CreateMessageUseCase,
    @Optional() private readonly chatAIService?: ChatAIService,
    @Optional()
    @Inject("COOMB_AI_CLIENT_PORT")
    private readonly coombAI?: CoombAIClientPort,
    @Optional() private readonly sessionService?: SessionService
  ) {}

  async create(
    chatId: string | null | undefined,
    createMessageDto: CreateMessageDto,
    userId: string | null
  ): Promise<{ message: MessageEntity; chatId: string }> {
    const result = await this.createMessageUseCase.execute({
      chatId,
      data: createMessageDto,
      userId,
    });

    if (createMessageDto.messageType === MessageType.USER) {
      await this.processAssistantResponse(result.chatId, userId);
    }

    await this.updateChatMetadata(result.chatId);

    return result;
  }

  async createWithStream(
    chatId: string | null | undefined,
    createMessageDto: CreateMessageDto,
    userId: string | null
  ): Promise<{
    chatId: string;
    assistantMessageId: string;
    contentStream: Observable<{
      content: string;
      citations?: Array<{ url: string }>;
    }>;
  }> {
    const result = await this.createMessageUseCase.execute({
      chatId,
      data: createMessageDto,
      userId,
    });

    const assistantMessage = await this.messageRepository.create({
      chat_id: result.chatId,
      content: "",
      messageType: MessageType.ASSISTANT,
      pdf_url: null,
    });

    await this.updateChatMetadata(result.chatId);

    if (!this.chatAIService) {
      return {
        chatId: result.chatId,
        assistantMessageId: assistantMessage.id,
        contentStream: new Observable((observer) => {
          observer.next({ content: "Serviço de IA não disponível." });
          observer.complete();
        }),
      };
    }

    const messages = await this.messageRepository.findByChatId(result.chatId);

    let fullContent = "";
    let collectedCitations: Array<{ url: string }> | undefined;

    const contentStream = new Observable<{
      content: string;
      citations?: Array<{ url: string }>;
    }>((observer) => {
      this.chatAIService!.generateAssistantResponseStream(messages, userId, undefined).subscribe({
        next: (chunk) => {
          fullContent += chunk.content;
          if (chunk.citations) collectedCitations = chunk.citations;
          observer.next(chunk);
        },
        complete: async () => {
          await this.messageRepository.update(assistantMessage.id, {
            content: fullContent,
            citations: collectedCitations || null,
          });
          await this.updateChatMetadata(result.chatId);
          observer.complete();
        },
        error: (error) => observer.error(error),
      });
    });

    return {
      chatId: result.chatId,
      assistantMessageId: assistantMessage.id,
      contentStream,
    };
  }

  async findByChatId(chatId: string, userId: string | null): Promise<MessageEntity[]> {
    await this.validateChatAccess(chatId, userId);
    return this.messageRepository.findByChatId(chatId);
  }

  async search(searchDto: SearchMessagesDto, userId: string): Promise<MessageEntity[]> {
    await this.validateChatAccess(searchDto.chatId, userId);
    return this.messageRepository.search(searchDto.chatId, searchDto.query);
  }

  async uploadResume(
    chatId: string | null | undefined,
    file: Express.Multer.File | undefined,
    fileName: string,
    _jobDescription: string | undefined,
    userId: string | null,
    sessionId?: string
  ): Promise<{ chatId: string; data?: any }> {
    const result = await this.createMessageUseCase.execute({
      chatId,
      data: { content: "", messageType: MessageType.USER },
      userId,
    });

    const currentChatId = result.chatId;
    await this.validateChatAccess(currentChatId, userId);

    const { messageContent, extractedResumeData } = await this.processResumeUpload(file, fileName);

    if (!userId && sessionId && extractedResumeData && this.sessionService) {
      await this.sessionService.updateSessionData(sessionId, extractedResumeData);
    }

    await this.messageRepository.create({
      chat_id: currentChatId,
      content: messageContent,
      messageType: MessageType.USER,
      pdf_url: null,
    });

    await this.processAssistantResponse(currentChatId, userId, extractedResumeData);
    await this.updateChatMetadata(currentChatId);

    return { chatId: currentChatId, data: extractedResumeData };
  }

  private async validateChatAccess(chatId: string, userId: string | null): Promise<void> {
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) throw new NotFoundException("Conversa não encontrada");
    if (userId && chat.user_id !== userId) throw new ForbiddenException("Acesso negado");
    if (!userId && chat.user_id !== null) throw new ForbiddenException("Acesso negado");
  }

  private async processAssistantResponse(
    chatId: string,
    userId: string | null,
    temporaryResumeData?: any
  ): Promise<void> {
    if (!this.chatAIService) return;

    const messages = await this.messageRepository.findByChatId(chatId);
    const assistantResponse = await this.chatAIService.generateAssistantResponse(
      messages,
      userId,
      undefined,
      temporaryResumeData
    );

    await this.messageRepository.create({
      chat_id: chatId,
      content: assistantResponse.content,
      messageType: MessageType.ASSISTANT,
      pdf_url: null,
    });

    await this.updateChatMetadata(chatId);

    if (assistantResponse.pdfUrl) {
      await this.messageRepository.create({
        chat_id: chatId,
        content: "",
        messageType: MessageType.ASSISTANT,
        pdf_url: assistantResponse.pdfUrl,
      });
      await this.updateChatMetadata(chatId);
    }
  }

  private async updateChatMetadata(chatId: string): Promise<void> {
    await this.chatRepository.updateMetadata(chatId);
  }

  private async processResumeUpload(
    file: Express.Multer.File | undefined,
    fileName: string
  ): Promise<{ messageContent: string; extractedResumeData: any }> {
    let messageContent = `Arquivo anexado: ${fileName}`;
    let extractedResumeData: any = null;

    if (!file || !this.coombAI) {
      return { messageContent, extractedResumeData };
    }

    try {
      const extractedText = await this.coombAI.extractText(file.buffer, fileName);
      extractedResumeData = { raw_text: extractedText };
      messageContent = `Arquivo anexado: ${fileName}\n\n=== CONTEÚDO DO CURRÍCULO ===\n${extractedText}`;
    } catch (error) {
      this.logger.error("Erro ao processar arquivo:", error);
    }

    return { messageContent, extractedResumeData };
  }
}

