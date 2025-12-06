import { Injectable, NotFoundException } from "@nestjs/common";
import { ResumeRepository } from "../repositories/resume.repository";
import { CompletionScoreService } from "./completion-score.service";
import { RESUME_INCLUDE } from "../constants/resume.constants";
import { CreateLanguageDto, UpdateLanguageDto } from "../dtos/create-language.dto";
import { ResumeEntity } from "../entities/resume.entity";
import { Language } from "../types/resume-array-items.types";
import { randomUUID } from "crypto";
import { recalculateCompletionScore } from "../utils/resume-completion.helper";
import { toJsonValue, fromJsonValue } from "../utils/json-value.helper";

@Injectable()
export class LanguageService {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly completionScoreService: CompletionScoreService
  ) {}

  async add(userId: string, data: CreateLanguageDto): Promise<ResumeEntity> {
    return this.resumeRepository
      .transaction(async (tx) => {
        const resume = await tx.resume.findFirst({
          where: { user_id: userId },
          include: RESUME_INCLUDE,
        });

        if (!resume) {
          throw new NotFoundException("Resumo não encontrado");
        }

        const languages = fromJsonValue<Language>(resume.languages);

        const newLanguage: Language = {
          id: randomUUID(),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const updatedResume = await tx.resume.update({
          where: { id: resume.id },
          data: {
            languages: toJsonValue([...languages, newLanguage]),
          },
          include: RESUME_INCLUDE,
        });

        return recalculateCompletionScore(tx, updatedResume, this.completionScoreService);
      })
      .then((resume) => new ResumeEntity(resume));
  }

  async update(
    userId: string,
    languageId: string,
    data: UpdateLanguageDto
  ): Promise<ResumeEntity> {
    return this.resumeRepository
      .transaction(async (tx) => {
        const resume = await tx.resume.findFirst({
          where: { user_id: userId },
          include: RESUME_INCLUDE,
        });

        if (!resume) {
          throw new NotFoundException("Resumo não encontrado");
        }

        const languages = fromJsonValue<Language>(resume.languages);

        const index = languages.findIndex((lang) => lang.id === languageId);

        if (index === -1) {
          throw new NotFoundException("Idioma não encontrado");
        }

        languages[index] = {
          ...languages[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };

        const updatedResume = await tx.resume.update({
          where: { id: resume.id },
          data: {
            languages: toJsonValue(languages),
          },
          include: RESUME_INCLUDE,
        });

        return recalculateCompletionScore(tx, updatedResume, this.completionScoreService);
      })
      .then((resume) => new ResumeEntity(resume));
  }

  async delete(userId: string, languageId: string): Promise<ResumeEntity> {
    return this.resumeRepository
      .transaction(async (tx) => {
        const resume = await tx.resume.findFirst({
          where: { user_id: userId },
          include: RESUME_INCLUDE,
        });

        if (!resume) {
          throw new NotFoundException("Resumo não encontrado");
        }

        const languages = fromJsonValue<Language>(resume.languages);

        const filtered = languages.filter((lang) => lang.id !== languageId);

        if (filtered.length === languages.length) {
          throw new NotFoundException("Idioma não encontrado");
        }

        const updatedResume = await tx.resume.update({
          where: { id: resume.id },
          data: {
            languages: toJsonValue(filtered),
          },
          include: RESUME_INCLUDE,
        });

        return recalculateCompletionScore(tx, updatedResume, this.completionScoreService);
      })
      .then((resume) => new ResumeEntity(resume));
  }

}

