import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { ResumeRepository } from "../repositories/resume.repository";
import { CompletionScoreService } from "./completion-score.service";
import { RESUME_INCLUDE } from "../constants/resume.constants";
import {
  CreateEducationDto,
  UpdateEducationDto,
} from "../dtos/create-education.dto";
import { Resume } from "@prisma/client";
import { Education } from "../types/resume-array-items.types";
import { randomUUID } from "crypto";
import { recalculateCompletionScore } from "../utils/resume-completion.helper";
import { toJsonValue, fromJsonValue } from "../utils/json-value.helper";

@Injectable()
export class EducationService {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly completionScoreService: CompletionScoreService
  ) {}

  async add(userId: string, data: CreateEducationDto): Promise<Resume> {
    this.validateEducationDates(data);

    return this.resumeRepository
      .transaction(async (tx) => {
        const resume = await tx.resume.findFirst({
          where: { user_id: userId },
          include: RESUME_INCLUDE,
        });

        if (!resume) {
          throw new NotFoundException("Resumo não encontrado");
        }

        const educations = fromJsonValue<Education>(resume.educations);

        const newEducation: Education = {
          id: randomUUID(),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const updatedResume = await tx.resume.update({
          where: { id: resume.id },
          data: {
            educations: toJsonValue([...educations, newEducation]),
          },
          include: RESUME_INCLUDE,
        });

        return recalculateCompletionScore(
          tx,
          updatedResume,
          this.completionScoreService
        );
      })
      .then((resume) => resume);
  }

  async update(
    userId: string,
    educationId: string,
    data: UpdateEducationDto
  ): Promise<Resume> {
    return this.resumeRepository
      .transaction(async (tx) => {
        const resume = await tx.resume.findFirst({
          where: { user_id: userId },
          include: RESUME_INCLUDE,
        });

        if (!resume) {
          throw new NotFoundException("Resumo não encontrado");
        }

        const educations = fromJsonValue<Education>(resume.educations);

        const index = educations.findIndex((edu) => edu.id === educationId);

        if (index === -1) {
          throw new NotFoundException("Educação não encontrada");
        }

        const updatedEducation = {
          ...educations[index],
          ...data,
        };

        this.validateEducationDates(updatedEducation);

        educations[index] = {
          ...updatedEducation,
          updatedAt: new Date().toISOString(),
        };

        const updatedResume = await tx.resume.update({
          where: { id: resume.id },
          data: {
            educations: toJsonValue(educations),
          },
          include: RESUME_INCLUDE,
        });

        return recalculateCompletionScore(
          tx,
          updatedResume,
          this.completionScoreService
        );
      })
      .then((resume) => resume);
  }

  async delete(userId: string, educationId: string): Promise<Resume> {
    return this.resumeRepository
      .transaction(async (tx) => {
        const resume = await tx.resume.findFirst({
          where: { user_id: userId },
          include: RESUME_INCLUDE,
        });

        if (!resume) {
          throw new NotFoundException("Resumo não encontrado");
        }

        const educations = fromJsonValue<Education>(resume.educations);

        const filtered = educations.filter((edu) => edu.id !== educationId);

        if (filtered.length === educations.length) {
          throw new NotFoundException("Educação não encontrada");
        }

        const updatedResume = await tx.resume.update({
          where: { id: resume.id },
          data: {
            educations: toJsonValue(filtered),
          },
          include: RESUME_INCLUDE,
        });

        return recalculateCompletionScore(
          tx,
          updatedResume,
          this.completionScoreService
        );
      })
      .then((resume) => resume);
  }

  private validateEducationDates(data: CreateEducationDto | Education) {
    if (data.current && data.endDate) {
      throw new BadRequestException(
        "Data de término não pode ser informada quando 'atual' está marcado"
      );
    }

    if (!data.current && !data.endDate) {
      throw new BadRequestException(
        "Data de término é obrigatória quando 'atual' não está marcado"
      );
    }

    if (!data.current && data.endDate) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (startDate >= endDate) {
        throw new BadRequestException(
          "Data de início deve ser anterior à data de término"
        );
      }

      if (endDate > today) {
        throw new BadRequestException("Data de término não pode ser no futuro");
      }
    }
  }
}
