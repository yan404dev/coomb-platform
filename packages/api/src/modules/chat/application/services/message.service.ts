import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Optional,
  Inject,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { MessageRepositoryPort } from "../../domain/ports/message.repository.port";
import { ChatRepositoryPort } from "../../domain/ports/chat.repository.port";
import { SearchMessagesDto } from "../../dto/search-messages.dto";
import { CreateMessageDto } from "../../dto/create-message.dto";
import { Message } from "@prisma/client";
import { MessageType } from "../../dto/create-message.dto";
import {
  CoombAIClientPort,
  ChatMessage,
} from "../../../ai/domain/ports/coomb-ai-client.port";
import { SessionService } from "../../services/session.service";
import { CreateMessageUseCase } from "../use-cases/create-message.use-case";
import { INJECTION_TOKENS } from "../../../../common/constants/injection-tokens";

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @Inject(INJECTION_TOKENS.MESSAGE_REPOSITORY_PORT)
    private readonly messageRepository: MessageRepositoryPort,
    @Inject(INJECTION_TOKENS.CHAT_REPOSITORY_PORT)
    private readonly chatRepository: ChatRepositoryPort,
    private readonly createMessageUseCase: CreateMessageUseCase,
    @Optional()
    @Inject(INJECTION_TOKENS.COOMB_AI_CLIENT_PORT)
    private readonly coombAI?: CoombAIClientPort,
    @Optional() private readonly sessionService?: SessionService
  ) {}

  async create(
    chatId: string | null | undefined,
    createMessageDto: CreateMessageDto,
    userId: string | null
  ): Promise<{ message: Message; chatId: string }> {
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
      pdf_url: undefined,
    });

    await this.updateChatMetadata(result.chatId);

    if (!this.coombAI) {
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
    const chatMessages: ChatMessage[] = messages.map(
      (msg: Message): ChatMessage => ({
        role: (msg.role === "USER" ? "user" : "assistant") as
          | "user"
          | "assistant",
        content: msg.content,
      })
    );

    let fullContent = "";

    const streamObservable = await this.coombAI.chatStream(
      chatMessages,
      userId
    );

    const contentStream = new Observable<{
      content: string;
      citations?: Array<{ url: string }>;
    }>((observer) => {
      streamObservable.subscribe({
        next: (chunk: {
          content: string;
          is_complete: boolean;
          citations?: Array<{ url: string }>;
        }) => {
          fullContent += chunk.content;
          observer.next({
            content: chunk.content,
            citations: chunk.citations,
          });
        },
        complete: async () => {
          await this.messageRepository.update(assistantMessage.id, {
            content: fullContent,
          });
          await this.updateChatMetadata(result.chatId);
          observer.complete();
        },
        error: (error: unknown) => observer.error(error),
      });
    });

    return {
      chatId: result.chatId,
      assistantMessageId: assistantMessage.id,
      contentStream,
    };
  }

  async findByChatId(
    chatId: string,
    userId: string | null
  ): Promise<Message[]> {
    await this.validateChatAccess(chatId, userId);
    return this.messageRepository.findByChatId(chatId);
  }

  async search(
    searchDto: SearchMessagesDto,
    userId: string
  ): Promise<Message[]> {
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
  ): Promise<{ chatId: string; data?: { raw_text: string } | null }> {
    const result = await this.createMessageUseCase.execute({
      chatId,
      data: { content: "", messageType: MessageType.USER },
      userId,
    });

    const currentChatId = result.chatId;
    await this.validateChatAccess(currentChatId, userId);

    const { messageContent, extractedResumeData } =
      await this.processResumeUpload(file, fileName);

    if (!userId && sessionId && extractedResumeData && this.sessionService) {
      await this.sessionService.updateSessionData(
        sessionId,
        extractedResumeData
      );
    }

    await this.messageRepository.create({
      chat_id: currentChatId,
      content: messageContent,
      messageType: MessageType.USER,
      pdf_url: undefined,
    });

    await this.processAssistantResponse(
      currentChatId,
      userId,
      extractedResumeData?.raw_text
    );
    await this.updateChatMetadata(currentChatId);

    return { chatId: currentChatId, data: extractedResumeData };
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

  private async processAssistantResponse(
    chatId: string,
    userId: string | null,
    _resumeContext?: string
  ): Promise<void> {
    if (!this.coombAI) return;

    const messages = await this.messageRepository.findByChatId(chatId);

    const chatMessages: ChatMessage[] = messages.map(
      (msg: Message): ChatMessage => ({
        role: (msg.role === "USER" ? "user" : "assistant") as
          | "user"
          | "assistant",
        content: msg.content,
      })
    );

    const assistantResponse = await this.coombAI.chatCompletion(
      chatMessages,
      userId
    );

    const pdfUrl = assistantResponse.pdf_url
      ? `${process.env.COOMB_AI_URL || "http://localhost:8000"}${assistantResponse.pdf_url}`
      : undefined;

    await this.messageRepository.create({
      chat_id: chatId,
      content: assistantResponse.content,
      messageType: MessageType.ASSISTANT,
      pdf_url: pdfUrl,
    });

    await this.updateChatMetadata(chatId);
  }

  private async updateChatMetadata(chatId: string): Promise<void> {
    await this.chatRepository.updateMetadata(chatId);
  }

  private async processResumeUpload(
    file: Express.Multer.File | undefined,
    fileName: string
  ): Promise<{
    messageContent: string;
    extractedResumeData: { raw_text: string } | null;
  }> {
    let messageContent = `Arquivo anexado: ${fileName}`;
    let extractedResumeData: { raw_text: string } | null = null;

    if (!file || !this.coombAI) {
      return { messageContent, extractedResumeData };
    }

    try {
      const extractedText = await this.coombAI.extractText(
        file.buffer,
        fileName
      );
      extractedResumeData = { raw_text: extractedText };

      messageContent = `Arquivo anexado: ${fileName}\n\n=== CONTEÚDO DO CURRÍCULO ===\n${extractedText}`;
    } catch (error) {
      this.logger.error("Erro ao processar arquivo:", error);
    }

    return { messageContent, extractedResumeData };
  }
}
