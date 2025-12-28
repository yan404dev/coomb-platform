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
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "../auth/guards/optional-jwt-auth.guard";
import { ChatService } from "./chat.service";
import { MessageService } from "./message.service";
import { CreateChatDto } from "./dtos/create-chat.dto";
import { UpdateChatTitleDto } from "./dtos/update-chat-title.dto";
import { CreateMessageDto } from "./dtos/create-message.dto";
import { UploadResumeDto } from "./dtos/upload-resume.dto";

@Controller("api/v1/chats")
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createChatDto: CreateChatDto, @Request() req: any) {
    return this.chatService.create(createChatDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req: any) {
    return this.chatService.findAll(req.user.id);
  }

  @Get(":id")
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(@Param("id") id: string, @Request() req: any) {
    return this.chatService.findById(id, req.user?.id);
  }

  @Patch(":id/title")
  @UseGuards(JwtAuthGuard)
  async updateTitle(
    @Param("id") id: string,
    @Body() updateDto: UpdateChatTitleDto,
    @Request() req: any
  ) {
    return this.chatService.updateTitle(id, updateDto, req.user.id);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async remove(@Param("id") id: string, @Request() req: any) {
    return this.chatService.delete(id, req.user.id);
  }

  @Post("messages")
  @UseGuards(OptionalJwtAuthGuard)
  async createMessageWithoutChat(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req: any
  ) {
    return this.messageService.create(null, createMessageDto, req.user?.id);
  }

  @Post(":id/messages")
  @UseGuards(OptionalJwtAuthGuard)
  async createMessage(
    @Param("id") id: string,
    @Body() createMessageDto: CreateMessageDto,
    @Request() req: any
  ) {
    return this.messageService.create(id, createMessageDto, req.user?.id);
  }

  @Get(":id/messages")
  @UseGuards(OptionalJwtAuthGuard)
  async getMessages(@Param("id") id: string, @Request() req: any) {
    return this.messageService.findByChatId(id, req.user?.id);
  }

  @Post("upload-resume")
  @UseGuards(OptionalJwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async uploadResume(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadResumeDto,
    @Request() req: any
  ) {
    return this.messageService.uploadResume(
      null,
      file,
      uploadDto.fileName,
      uploadDto.jobDescription,
      req.user?.id
    );
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
    return this.messageService.uploadResume(
      id,
      file,
      uploadDto.fileName,
      uploadDto.jobDescription,
      req.user?.id
    );
  }
}
