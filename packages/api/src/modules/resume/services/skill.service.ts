import { Injectable, NotFoundException } from "@nestjs/common";
import { ResumeRepository } from "../repositories/resume.repository";
import { CompletionScoreService } from "./completion-score.service";
import { RESUME_INCLUDE } from "../constants/resume.constants";
import { CreateSkillDto, UpdateSkillDto } from "../dtos/create-skill.dto";
import { ResumeEntity } from "../entities/resume.entity";
import { Skill } from "../types/resume-array-items.types";
import { randomUUID } from "crypto";
import { recalculateCompletionScore } from "../utils/resume-completion.helper";
import { toJsonValue, fromJsonValue } from "../utils/json-value.helper";

@Injectable()
export class SkillService {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly completionScoreService: CompletionScoreService
  ) {}

  async add(userId: string, data: CreateSkillDto): Promise<ResumeEntity> {
    return this.resumeRepository
      .transaction(async (tx) => {
        const resume = await tx.resume.findFirst({
          where: { user_id: userId },
          include: RESUME_INCLUDE,
        });

        if (!resume) {
          throw new NotFoundException("Resumo não encontrado");
        }

        const skills = fromJsonValue<Skill>(resume.skills);

        const newSkill: Skill = {
          id: randomUUID(),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const updatedResume = await tx.resume.update({
          where: { id: resume.id },
          data: {
            skills: toJsonValue([...skills, newSkill]),
          },
          include: RESUME_INCLUDE,
        });

        return recalculateCompletionScore(
          tx,
          updatedResume,
          this.completionScoreService
        );
      })
      .then((resume) => new ResumeEntity(resume));
  }

  async update(
    userId: string,
    skillId: string,
    data: UpdateSkillDto
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

        const skills = fromJsonValue<Skill>(resume.skills);

        const index = skills.findIndex((skill) => skill.id === skillId);

        if (index === -1) {
          throw new NotFoundException("Skill não encontrada");
        }

        skills[index] = {
          ...skills[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };

        const updatedResume = await tx.resume.update({
          where: { id: resume.id },
          data: {
            skills: toJsonValue(skills),
          },
          include: RESUME_INCLUDE,
        });

        return recalculateCompletionScore(
          tx,
          updatedResume,
          this.completionScoreService
        );
      })
      .then((resume) => new ResumeEntity(resume));
  }

  async delete(userId: string, skillId: string): Promise<ResumeEntity> {
    return this.resumeRepository
      .transaction(async (tx) => {
        const resume = await tx.resume.findFirst({
          where: { user_id: userId },
          include: RESUME_INCLUDE,
        });

        if (!resume) {
          throw new NotFoundException("Resumo não encontrado");
        }

        const skills = fromJsonValue<Skill>(resume.skills);

        const filtered = skills.filter((skill) => skill.id !== skillId);

        if (filtered.length === skills.length) {
          throw new NotFoundException("Skill não encontrada");
        }

        const updatedResume = await tx.resume.update({
          where: { id: resume.id },
          data: {
            skills: toJsonValue(filtered),
          },
          include: RESUME_INCLUDE,
        });

        return recalculateCompletionScore(
          tx,
          updatedResume,
          this.completionScoreService
        );
      })
      .then((resume) => new ResumeEntity(resume));
  }
}
