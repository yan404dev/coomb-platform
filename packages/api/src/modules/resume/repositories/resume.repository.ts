import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../common/prisma/prisma.service";
import { BaseRepository } from "../../../common/repositories/base.repository";
import { Resume, Prisma } from "@prisma/client";
import { RESUME_INCLUDE } from "../constants/resume.constants";

type ResumeWithIncludes = Prisma.ResumeGetPayload<{
  include: typeof RESUME_INCLUDE;
}>;

@Injectable()
export class ResumeRepository extends BaseRepository<
  Resume,
  Prisma.ResumeCreateInput,
  Prisma.ResumeUpdateInput,
  Prisma.ResumeWhereInput,
  Prisma.ResumeWhereUniqueInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, prisma.resume);
  }

  async findByUserId(userId: string): Promise<ResumeWithIncludes | null> {
    return this.findFirst({ user_id: userId }, RESUME_INCLUDE, {
      updated_at: "desc",
    }) as Promise<ResumeWithIncludes | null>;
  }

  async findByIdWithRelations(
    resumeId: string,
    userId: string
  ): Promise<ResumeWithIncludes | null> {
    return this.findFirst(
      {
        id: resumeId,
        user_id: userId,
      },
      RESUME_INCLUDE
    ) as Promise<ResumeWithIncludes | null>;
  }

  async createWithRelations(
    data: Prisma.ResumeCreateInput
  ): Promise<ResumeWithIncludes> {
    return this.create(data, RESUME_INCLUDE) as Promise<ResumeWithIncludes>;
  }

  async updateWithRelations(
    where: Prisma.ResumeWhereUniqueInput,
    data: Prisma.ResumeUpdateInput
  ): Promise<ResumeWithIncludes> {
    return this.update(
      where,
      data,
      RESUME_INCLUDE
    ) as Promise<ResumeWithIncludes>;
  }
}
