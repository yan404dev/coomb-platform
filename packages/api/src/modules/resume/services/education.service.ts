import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../common/prisma/prisma.service";
import { ResumeService } from "../resume.service";
import { CreateEducationDto, UpdateEducationDto } from "../dtos/create-education.dto";
import { Education } from "../entities/education.entity";

@Injectable()
export class EducationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly resumeService: ResumeService
  ) { }

  async add(userId: string, data: CreateEducationDto): Promise<Education> {
    const resume = await this.resumeService.findUserResume(userId);

    return this.prisma.education.create({
      data: {
        resume_id: resume.id,
        institution: data.institution,
        degree: data.degree,
        start_date: data.startDate,
        end_date: data.endDate || null,
        current: data.current,
      },
    });
  }

  async update(userId: string, educationId: string, data: UpdateEducationDto): Promise<Education> {
    const resume = await this.resumeService.findUserResume(userId);

    const education = await this.prisma.education.findFirst({
      where: {
        id: educationId,
        resume_id: resume.id,
      },
    });

    if (!education) {
      throw new NotFoundException("Education não encontrada");
    }

    return this.prisma.education.update({
      where: { id: educationId },
      data: {
        institution: data.institution,
        degree: data.degree,
        start_date: data.startDate,
        end_date: data.endDate || undefined,
        current: data.current,
      },
    });
  }

  async delete(userId: string, educationId: string): Promise<void> {
    const resume = await this.resumeService.findUserResume(userId);

    const education = await this.prisma.education.findFirst({
      where: {
        id: educationId,
        resume_id: resume.id,
      },
    });

    if (!education) {
      throw new NotFoundException("Education não encontrada");
    }

    await this.prisma.education.delete({
      where: { id: educationId },
    });
  }
}
