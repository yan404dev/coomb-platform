import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../common/prisma/prisma.service";
import { BaseRepository } from "../../../common/repositories/base.repository";
import { Chat, Prisma } from "@prisma/client";

@Injectable()
export class ChatRepository extends BaseRepository<
  Chat,
  Prisma.ChatCreateInput,
  Prisma.ChatUpdateInput,
  Prisma.ChatWhereInput,
  Prisma.ChatWhereUniqueInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, prisma.chat);
  }

  async findByUserId(
    userId: string
  ): Promise<Array<Chat & { lastMessage?: string | null }>> {
    const chats = await this.model.findMany({
      where: {
        user_id: userId,
        deleted_at: null,
      },
      include: {
        messages: {
          take: 1,
          orderBy: {
            created_at: "desc",
          },
          select: {
            content: true,
          },
        },
      },
      orderBy: {
        last_message_at: "desc",
      },
    });

    return chats.map((chat: any) => ({
      ...chat,
      lastMessage: chat.messages?.[0]?.content || null,
    }));
  }

  async findById(id: string): Promise<Chat | null> {
    return this.model.findFirst({
      where: {
        id,
        deleted_at: null,
      },
    });
  }
}
