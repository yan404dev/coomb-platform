import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "../../auth/guards/optional-jwt-auth.guard";
import { ChatService } from "../application/services/chat.service";
import { MessageService } from "../application/services/message.service";
import { CreateChatDto } from "../dto/create-chat.dto";
import { UpdateChatTitleDto } from "../dto/update-chat-title.dto";
import { SearchMessagesDto } from "../dto/search-messages.dto";
import { CreateMessageDto } from "../dto/create-message.dto";
import { UploadResumeDto } from "../dto/upload-resume.dto";

@Controller("api/v1/chats")
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createChatDto: CreateChatDto, @Request() req: any) {
    const chat = await this.chatService.create(createChatDto, req.user.id);
    return {
      id: chat.id,
      title: chat.title,
      lastMessage: null,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req: any) {
    return this.chatService.findAll(req.user.id);
  }

  @Get(":id")
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(@Param("id") id: string, @Request() req: any) {
    const userId = req.user?.id || null;
    const chat = await this.chatService.findById(id, userId);
    return {
      id: chat.id,
      title: chat.title,
      lastMessage: null,
    };
  }

  @Patch(":id/title")
  @UseGuards(JwtAuthGuard)
  async updateTitle(
    @Param("id") id: string,
    @Body() updateDto: UpdateChatTitleDto,
    @Request() req: any
  ) {
    const chat = await this.chatService.updateTitle(id, updateDto, req.user.id);
    return {
      id: chat.id,
      title: chat.title,
      lastMessage: null,
    };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async remove(@Param("id") id: string, @Request() req: any) {
    await this.chatService.delete(id, req.user.id);
    return { message: "Conversa deletada com sucesso" };
  }

  @Post("messages")
  @UseGuards(OptionalJwtAuthGuard)
  async createMessageWithoutChat(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req: any
  ) {
    const userId = req.user?.id || null;
    const result = await this.messageService.create(
      null,
      createMessageDto,
      userId
    );
    return {
      id: result.message.id,
      chat_id: result.message.chat_id,
      chatId: result.chatId,
      messageType: result.message.messageType,
      content: result.message.content,
      pdf_url: result.message.pdf_url,
      citations: result.message.citations,
      created_at: result.message.created_at,
    };
  }

  @Post(":id/messages")
  @UseGuards(OptionalJwtAuthGuard)
  async createMessage(
    @Param("id") id: string,
    @Body() createMessageDto: CreateMessageDto,
    @Request() req: any
  ) {
    const userId = req.user?.id || null;
    const chatId = id === "new" || !id ? null : id;
    const result = await this.messageService.create(
      chatId,
      createMessageDto,
      userId
    );
    return {
      id: result.message.id,
      chat_id: result.message.chat_id,
      chatId: result.chatId,
      messageType: result.message.messageType,
      content: result.message.content,
      pdf_url: result.message.pdf_url,
      citations: result.message.citations,
      created_at: result.message.created_at,
    };
  }

  @Post(":id/messages/stream")
  @UseGuards(OptionalJwtAuthGuard)
  async createMessageStream(
    @Param("id") id: string,
    @Body() createMessageDto: CreateMessageDto,
    @Request() req: any,
    @Res() res: Response
  ): Promise<void> {
    const userId = req.user?.id || null;
    const chatId = id === "new" || !id ? null : id;

    // Headers para SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      // Cria a mensagem do usuário e retorna o stream da resposta da IA
      const streamResult = await this.messageService.createWithStream(
        chatId,
        createMessageDto,
        userId
      );

      // Subscreve ao stream e envia chunks via SSE
      streamResult.contentStream.subscribe({
        next: (chunk: { content: string; citations?: Array<{ url: string }> }) => {
          const data = JSON.stringify({
            chunk: chunk.content,
            chatId: streamResult.chatId,
            messageId: streamResult.assistantMessageId,
            citations: chunk.citations,
          });
          res.write(`data: ${data}\n\n`);
        },
        complete: () => {
          res.end();
        },
        error: (error) => {
          console.error("Erro no streaming:", error);
          res.end();
        },
      });
    } catch (error) {
      console.error("Erro ao criar stream:", error);
      res.status(500).end();
    }
  }

  @Get(":id/messages")
  @UseGuards(OptionalJwtAuthGuard)
  async getMessages(@Param("id") id: string, @Request() req: any) {
    const userId = req.user?.id || null;
    const messages = await this.messageService.findByChatId(id, userId);
    return messages.map((msg) => ({
      id: msg.id,
      chat_id: msg.chat_id,
      messageType: msg.messageType,
      content: msg.content,
      pdf_url: msg.pdf_url,
      citations: msg.citations,
      created_at: msg.created_at,
    }));
  }

  @Post(":id/messages/search")
  @UseGuards(JwtAuthGuard)
  async searchMessages(
    @Param("id") chatId: string,
    @Body() searchDto: Omit<SearchMessagesDto, "chatId">,
    @Request() req: any
  ) {
    const messages = await this.messageService.search(
      { ...searchDto, chatId },
      req.user.id
    );
    return messages.map((msg) => ({
      id: msg.id,
      chat_id: msg.chat_id,
      messageType: msg.messageType,
      content: msg.content,
      pdf_url: msg.pdf_url,
      citations: msg.citations,
      created_at: msg.created_at,
    }));
  }

  @Post("upload-resume")
  @UseGuards(OptionalJwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async uploadResume(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadResumeDto,
    @Request() req: any
  ) {
    if (!file && !uploadDto.fileName) {
      throw new BadRequestException("Arquivo ou nome do arquivo é obrigatório");
    }

    const fileName = file?.originalname || uploadDto.fileName || "arquivo.pdf";
    const userId = req.user?.id || null;
    const result = await this.messageService.uploadResume(
      null,
      file,
      fileName,
      uploadDto.jobDescription,
      userId,
      uploadDto.sessionId
    );

    return result;
  }

  @Post(":id/upload-resume")
  @UseGuards(OptionalJwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async uploadResumeToChat(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadResumeDto,
    @Request() req: any
  ) {
    const chatId = id === "new" || !id ? null : id;

    if (!file && !uploadDto.fileName) {
      throw new BadRequestException("Arquivo ou nome do arquivo é obrigatório");
    }

    const fileName = file?.originalname || uploadDto.fileName || "arquivo.pdf";
    const userId = req.user?.id || null;
    const result = await this.messageService.uploadResume(
      chatId,
      file,
      fileName,
      uploadDto.jobDescription,
      userId,
      uploadDto.sessionId
    );

    return result;
  }
}
