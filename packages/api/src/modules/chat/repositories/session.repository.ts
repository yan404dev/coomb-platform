import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../common/prisma/prisma.service";
import { BaseRepository } from "../../../common/repositories/base.repository";
import { ChatSession, Prisma } from "@prisma/client";

@Injectable()
export class SessionRepository extends BaseRepository<
  ChatSession,
  Prisma.ChatSessionCreateInput,
  Prisma.ChatSessionUpdateInput,
  Prisma.ChatSessionWhereInput,
  Prisma.ChatSessionWhereUniqueInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, prisma.chatSession);
  }

  async findBySessionId(sessionId: string): Promise<ChatSession | null> {
    return this.model.findUnique({
      where: {
        session_id: sessionId,
      },
    });
  }

  async findActiveBySessionId(sessionId: string): Promise<ChatSession | null> {
    return this.model.findFirst({
      where: {
        session_id: sessionId,
        expires_at: {
          gte: new Date(),
        },
      },
    });
  }

  async findAnonymousSessions(limit: number = 100): Promise<ChatSession[]> {
    return this.model.findMany({
      where: {
        is_anonymous: true,
        user_id: null,
      },
      orderBy: {
        created_at: "desc",
      },
      take: limit,
    });
  }

  async countAnonymousSessions(): Promise<number> {
    return this.model.count({
      where: {
        is_anonymous: true,
        user_id: null,
      },
    });
  }

  async countConvertedSessions(startDate?: Date): Promise<number> {
    return this.model.count({
      where: {
        is_anonymous: false,
        converted_at: startDate
          ? {
              gte: startDate,
            }
          : {
              not: null,
            },
      },
    });
  }

  async deleteExpiredSessions(): Promise<number> {
    const result = await this.model.deleteMany({
      where: {
        expires_at: {
          lt: new Date(),
        },
        is_anonymous: true,
      },
    });

    return result.count;
  }
}
