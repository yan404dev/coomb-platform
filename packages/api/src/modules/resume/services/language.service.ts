import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../common/prisma/prisma.service";
import { ResumeService } from "../resume.service";
import { CreateLanguageDto, UpdateLanguageDto } from "../dtos/create-language.dto";
import { Language } from "../entities/language.entity";

@Injectable()
export class LanguageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly resumeService: ResumeService
  ) { }

  async add(userId: string, data: CreateLanguageDto): Promise<Language> {
    const resume = await this.resumeService.findUserResume(userId);

    return this.prisma.language.create({
      data: {
        resume_id: resume.id,
        name: data.name,
        proficiency: data.level,
      },
    });
  }

  async update(userId: string, languageId: string, data: UpdateLanguageDto): Promise<Language> {
    const resume = await this.resumeService.findUserResume(userId);

    const language = await this.prisma.language.findFirst({
      where: {
        id: languageId,
        resume_id: resume.id,
      },
    });

    if (!language) {
      throw new NotFoundException("Language não encontrada");
    }

    return this.prisma.language.update({
      where: { id: languageId },
      data: {
        name: data.name,
        proficiency: data.level,
      },
    });
  }

  async delete(userId: string, languageId: string): Promise<void> {
    const resume = await this.resumeService.findUserResume(userId);

    const language = await this.prisma.language.findFirst({
      where: {
        id: languageId,
        resume_id: resume.id,
      },
    });

    if (!language) {
      throw new NotFoundException("Language não encontrada");
    }

    await this.prisma.language.delete({
      where: { id: languageId },
    });
  }
}
