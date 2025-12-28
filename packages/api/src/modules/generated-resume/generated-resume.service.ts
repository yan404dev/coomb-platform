import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateGeneratedResumeDto } from "./dtos/create-generated-resume.dto";
import { UpdateGeneratedResumeDto } from "./dtos/update-generated-resume.dto";

@Injectable()
export class GeneratedResumeService {
  constructor(private readonly prisma: PrismaService) { }

  async create(userId: string, data: CreateGeneratedResumeDto) {
    // Precisamos de resumeId - pegar do user ou criar um
    const resume = await this.prisma.resume.findUnique({
      where: { user_id: userId },
    });

    if (!resume) {
      throw new NotFoundException("Resume base não encontrado");
    }

    return this.prisma.generatedResume.create({
      data: {
        ...data,
        user_id: userId,
        resumeId: resume.id,
      } as any,
    });
  }

  async findAll(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [resumes, total] = await Promise.all([
      this.prisma.generatedResume.findMany({
        where: { user_id: userId },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      this.prisma.generatedResume.count({ where: { user_id: userId } }),
    ]);

    return {
      data: resumes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const resume = await this.prisma.generatedResume.findFirst({
      where: {
        id,
        user_id: userId,
      },
    });

    if (!resume) {
      throw new NotFoundException("Currículo gerado não encontrado");
    }

    return resume;
  }

  async update(id: string, userId: string, data: UpdateGeneratedResumeDto) {
    await this.findOne(id, userId);

    return this.prisma.generatedResume.update({
      where: { id },
      data: data as any,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.generatedResume.delete({
      where: { id },
    });
  }
}
