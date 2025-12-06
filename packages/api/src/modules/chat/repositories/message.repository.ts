import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../common/prisma/prisma.service";
import { BaseRepository } from "../../../common/repositories/base.repository";
import { Message, Prisma } from "@prisma/client";

@Injectable()
export class MessageRepository extends BaseRepository<
  Message,
  Prisma.MessageCreateInput,
  Prisma.MessageUpdateInput,
  Prisma.MessageWhereInput,
  Prisma.MessageWhereUniqueInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, prisma.message);
  }

  async findByChatId(chatId: string): Promise<Message[]> {
    return this.findMany(
      {
        chat_id: chatId,
      },
      {
        orderBy: {
          created_at: "asc",
        },
      }
    );
  }

  async search(chatId: string, query: string): Promise<Message[]> {
    return this.findMany({
      chat_id: chatId,
      content: {
        contains: query,
        mode: "insensitive",
      },
    });
  }
}
