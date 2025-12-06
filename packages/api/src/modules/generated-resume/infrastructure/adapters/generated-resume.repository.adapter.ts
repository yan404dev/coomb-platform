import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../../../../common/prisma/prisma.service";
import { GeneratedResume } from "@prisma/client";
import { CreateGeneratedResumeDto } from "../../dto/create-generated-resume.dto";
import { UpdateGeneratedResumeDto } from "../../dto/update-generated-resume.dto";
import { GeneratedResumeRepositoryPort } from "../../domain/ports/generated-resume.repository.port";

@Injectable()
export class GeneratedResumeRepositoryAdapter implements GeneratedResumeRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateGeneratedResumeDto): Promise<GeneratedResume> {
    const baseResume = await this.prisma.resume.findFirst({
      where: {
        user_id: userId,
        deleted_at: null,
      },
      include: { user: true },
      orderBy: { updated_at: "desc" },
    });

    if (!baseResume) {
      throw new NotFoundException("Base resume not found for user. Please create a resume first.");
    }

    if (!baseResume.user) {
      throw new NotFoundException("User not found for resume");
    }

    const generatedResume = await this.prisma.generatedResume.create({
      data: {
        user_id: userId,
        resumeId: baseResume.id,
        title: data.title ?? "Currículo Otimizado",
        job_description: data.message,
      },
    });

    return generatedResume;
  }

  async findAll(userId: string, baseResumeId?: string): Promise<GeneratedResume[]> {
    const generatedResumes = await this.prisma.generatedResume.findMany({
      where: {
        user_id: userId,
        ...(baseResumeId ? { resumeId: baseResumeId } : {}),
      },
      orderBy: { created_at: "desc" },
    });

    return generatedResumes;
  }

  async findById(id: string, userId: string): Promise<GeneratedResume> {
    const generatedResume = await this.prisma.generatedResume.findUnique({
      where: { id },
    });

    if (!generatedResume) {
      throw new NotFoundException("Generated resume not found");
    }

    if (generatedResume.user_id !== userId) {
      throw new ForbiddenException("Access denied to this generated resume");
    }

    return generatedResume;
  }

  async update(
    id: string,
    userId: string,
    data: UpdateGeneratedResumeDto
  ): Promise<GeneratedResume> {
    const existingGeneratedResume = await this.prisma.generatedResume.findUnique({
      where: { id },
    });

    if (!existingGeneratedResume) {
      throw new NotFoundException("Generated resume not found");
    }

    if (existingGeneratedResume.user_id !== userId) {
      throw new ForbiddenException("Access denied to this generated resume");
    }

    const updateData = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) =>
          value !== undefined && key !== "user_id" && key !== "base_resume_id"
      )
    );

    const generatedResume = await this.prisma.generatedResume.update({
      where: { id },
      data: updateData,
    });

    return generatedResume;
  }

  async delete(id: string, userId: string): Promise<void> {
    const existingGeneratedResume = await this.prisma.generatedResume.findUnique({
      where: { id },
    });

    if (!existingGeneratedResume) {
      throw new NotFoundException("Generated resume not found");
    }

    if (existingGeneratedResume.user_id !== userId) {
      throw new ForbiddenException("Access denied to this generated resume");
    }

    await this.prisma.generatedResume.delete({
      where: { id },
    });
  }
}

