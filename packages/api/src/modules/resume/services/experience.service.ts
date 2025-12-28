import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../common/prisma/prisma.service";
import { ResumeService } from "../resume.service";
import { CreateExperienceDto, UpdateExperienceDto } from "../dtos/create-experience.dto";
import { Experience } from "../entities/experience.entity";

@Injectable()
export class ExperienceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly resumeService: ResumeService
  ) { }

  async add(userId: string, data: CreateExperienceDto): Promise<Experience> {
    const resume = await this.resumeService.findUserResume(userId);

    return this.prisma.experience.create({
      data: {
        resume_id: resume.id,
        company: data.company,
        position: data.position,
        description: data.description || null,
        start_date: data.startDate,
        end_date: data.endDate || null,
        current: data.current,
      },
    });
  }

  async update(
    userId: string,
    experienceId: string,
    data: UpdateExperienceDto
  ): Promise<Experience> {
    const resume = await this.resumeService.findUserResume(userId);

    // Verificar que a experience pertence ao resume do usuário
    const experience = await this.prisma.experience.findFirst({
      where: {
        id: experienceId,
        resume_id: resume.id,
      },
    });

    if (!experience) {
      throw new NotFoundException("Experience não encontrada");
    }

    return this.prisma.experience.update({
      where: { id: experienceId },
      data: {
        company: data.company,
        position: data.position,
        description: data.description || undefined,
        start_date: data.startDate,
        end_date: data.endDate || undefined,
        current: data.current,
      },
    });
  }

  async delete(userId: string, experienceId: string): Promise<void> {
    const resume = await this.resumeService.findUserResume(userId);

    const experience = await this.prisma.experience.findFirst({
      where: {
        id: experienceId,
        resume_id: resume.id,
      },
    });

    if (!experience) {
      throw new NotFoundException("Experience não encontrada");
    }

    await this.prisma.experience.delete({
      where: { id: experienceId },
    });
  }
}
