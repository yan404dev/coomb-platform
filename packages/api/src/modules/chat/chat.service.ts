import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateChatDto } from "./dtos/create-chat.dto";
import { UpdateChatTitleDto } from "./dtos/update-chat-title.dto";

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createChatDto: CreateChatDto, userId: string | null) {
    return this.prisma.chat.create({
      data: {
        user_id: userId,
        title: createChatDto.title || "Nova Conversa",
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.chat.findMany({
      where: { user_id: userId, deleted_at: null },
      orderBy: { last_message_at: "desc" },
      select: {
        id: true,
        title: true,
        message_count: true,
        last_message_at: true,
        created_at: true,
      },
    });
  }

  async findById(chatId: string, userId: string | null) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat || chat.deleted_at) {
      throw new NotFoundException("Chat não encontrado");
    }

    if (userId && chat.user_id !== userId) {
      throw new ForbiddenException("Acesso negado");
    }

    if (!userId && chat.user_id !== null) {
      throw new ForbiddenException("Acesso negado");
    }

    return chat;
  }

  async updateTitle(chatId: string, updateDto: UpdateChatTitleDto, userId: string) {
    await this.findById(chatId, userId);

    return this.prisma.chat.update({
      where: { id: chatId },
      data: { title: updateDto.title },
    });
  }

  async delete(chatId: string, userId: string) {
    await this.findById(chatId, userId);

    await this.prisma.chat.update({
      where: { id: chatId },
      data: { deleted_at: new Date() },
    });

    return { message: "Chat deletado com sucesso" };
  }
}
