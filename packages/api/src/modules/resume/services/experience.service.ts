import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { ResumeRepository } from "../repositories/resume.repository";
import { CompletionScoreService } from "./completion-score.service";
import { RESUME_INCLUDE } from "../constants/resume.constants";
import {
  CreateExperienceDto,
  UpdateExperienceDto,
} from "../dtos/create-experience.dto";
import { Resume } from "@prisma/client";
import { Experience } from "../types/resume-array-items.types";
import { randomUUID } from "crypto";
import { recalculateCompletionScore } from "../utils/resume-completion.helper";
import { toJsonValue, fromJsonValue } from "../utils/json-value.helper";

@Injectable()
export class ExperienceService {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly completionScoreService: CompletionScoreService
  ) {}

  async add(userId: string, data: CreateExperienceDto): Promise<Resume> {
    this.validateExperienceDates(data);

    return this.resumeRepository
      .transaction(async (tx) => {
        const resume = await tx.resume.findFirst({
          where: { user_id: userId },
          include: RESUME_INCLUDE,
        });

        if (!resume) {
          throw new NotFoundException("Resumo não encontrado");
        }

        const experiences = fromJsonValue<Experience>(resume.experiences);
        this.validateNoOverlap(experiences, data);

        const newExperience: Experience = {
          id: randomUUID(),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const updatedResume = await tx.resume.update({
          where: { id: resume.id },
          data: {
            experiences: toJsonValue([...experiences, newExperience]),
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
    experienceId: string,
    data: UpdateExperienceDto
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

        const experiences = fromJsonValue<Experience>(resume.experiences);

        const index = experiences.findIndex((exp) => exp.id === experienceId);

        if (index === -1) {
          throw new NotFoundException("Experiência não encontrada");
        }

        const updatedExperience = {
          ...experiences[index],
          ...data,
        };

        this.validateExperienceDates(updatedExperience);
        const otherExperiences = experiences.filter((_, i) => i !== index);
        this.validateNoOverlap(otherExperiences, updatedExperience);

        experiences[index] = {
          ...updatedExperience,
          updatedAt: new Date().toISOString(),
        };

        const updatedResume = await tx.resume.update({
          where: { id: resume.id },
          data: {
            experiences: toJsonValue(experiences),
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

  async delete(userId: string, experienceId: string): Promise<Resume> {
    return this.resumeRepository
      .transaction(async (tx) => {
        const resume = await tx.resume.findFirst({
          where: { user_id: userId },
          include: RESUME_INCLUDE,
        });

        if (!resume) {
          throw new NotFoundException("Resumo não encontrado");
        }

        const experiences = fromJsonValue<Experience>(resume.experiences);

        const filtered = experiences.filter((exp) => exp.id !== experienceId);

        if (filtered.length === experiences.length) {
          throw new NotFoundException("Experiência não encontrada");
        }

        const updatedResume = await tx.resume.update({
          where: { id: resume.id },
          data: {
            experiences: toJsonValue(filtered),
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

  private validateExperienceDates(data: CreateExperienceDto | Experience) {
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

  private validateNoOverlap(
    existingExperiences: Experience[],
    newExperience: CreateExperienceDto | Experience
  ) {
    const newStart = new Date(newExperience.startDate);
    const newEnd = newExperience.current
      ? new Date()
      : new Date(newExperience.endDate!);

    for (const existing of existingExperiences) {
      const existingStart = new Date(existing.startDate);
      const existingEnd = existing.current
        ? new Date()
        : new Date(existing.endDate!);

      if (
        (newStart >= existingStart && newStart <= existingEnd) ||
        (newEnd >= existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      ) {
        throw new BadRequestException(
          `Período sobrepõe experiência existente na empresa "${existing.company}"`
        );
      }
    }
  }
}
