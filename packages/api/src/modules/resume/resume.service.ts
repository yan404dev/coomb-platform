import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { UpdateResumeDto } from "./dtos/update-resume.dto";

@Injectable()
export class ResumeService {
  constructor(private readonly prisma: PrismaService) { }

  async createResume(userId: string) {
    const existingResume = await this.prisma.resume.findUnique({
      where: { user_id: userId },
    });

    if (existingResume) {
      return existingResume;
    }

    return this.prisma.resume.create({
      data: {
        user_id: userId,
      },
    });
  }

  async findUserResume(userId: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { user_id: userId },
      include: {
        experiences: {
          orderBy: { created_at: "desc" },
        },
        skills: {
          orderBy: { created_at: "desc" },
        },
        educations: {
          orderBy: { created_at: "desc" },
        },
        languages: {
          orderBy: { created_at: "desc" },
        },
        certifications: {
          orderBy: { created_at: "desc" },
        },
      },
    });

    if (!resume) {
      return this.createResume(userId);
    }

    return resume;
  }

  async updateResume(userId: string, data: UpdateResumeDto) {
    const resume = await this.findUserResume(userId);

    return this.prisma.resume.update({
      where: { id: resume.id },
      data: data as any,
    });
  }

  async findById(resumeId: string, userId: string) {
    const resume = await this.prisma.resume.findFirst({
      where: {
        id: resumeId,
        user_id: userId,
      },
      include: {
        experiences: true,
        skills: true,
        educations: true,
        languages: true,
        certifications: true,
      },
    });

    if (!resume) {
      throw new NotFoundException("Resumo não encontrado");
    }

    return resume;
  }

  async getCompletionDetails(userId: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { user_id: userId },
      include: {
        _count: {
          select: {
            experiences: true,
            skills: true,
            educations: true,
            languages: true,
            certifications: true,
          },
        },
      },
    });

    if (!resume) {
      throw new NotFoundException("Resume não encontrado");
    }

    const sections = {
      experiences: resume._count.experiences > 0,
      skills: resume._count.skills > 0,
      educations: resume._count.educations > 0,
      languages: resume._count.languages > 0,
      certifications: resume._count.certifications > 0,
    };

    const completedSections = Object.values(sections).filter(Boolean).length;
    const totalSections = Object.keys(sections).length;
    const completionScore = Math.round((completedSections / totalSections) * 100);

    return {
      completion_score: completionScore,
      sections,
      counts: resume._count,
      missing_sections: Object.entries(sections)
        .filter(([_, completed]) => !completed)
        .map(([section]) => section),
    };
  }
}
