import { Injectable } from "@nestjs/common";
import { Resume } from "@prisma/client";
import { ResumeRepository } from "../../repositories/resume.repository";
import { CompletionScoreService } from "../../services/completion-score.service";
import { UpdateResumeDto } from "../../dtos/update-resume.dto";
import { ResumeRepositoryPort } from "../../domain/ports/resume.repository.port";
import {
  DEFAULT_RESUME_DATA,
  RESUME_INCLUDE,
} from "../../constants/resume.constants";

@Injectable()
export class ResumeRepositoryAdapter implements ResumeRepositoryPort {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly completionScoreService: CompletionScoreService
  ) {}

  async findByUserId(userId: string): Promise<Resume | null> {
    const resume = await this.resumeRepository.findByUserId(userId);
    return resume;
  }

  async findById(resumeId: string, userId: string): Promise<Resume | null> {
    const resume = await this.resumeRepository.findByIdWithRelations(
      resumeId,
      userId
    );
    return resume;
  }

  async create(userId: string): Promise<Resume> {
    const resume = await this.resumeRepository.createWithRelations({
      user_id: userId,
      ...DEFAULT_RESUME_DATA,
    } as any);
    return resume;
  }

  async update(userId: string, data: UpdateResumeDto): Promise<Resume> {
    const updatedResume = await this.resumeRepository.transaction(
      async (tx) => {
        const currentResume = await tx.resume.findFirst({
          where: { user_id: userId },
          include: RESUME_INCLUDE,
        });

        if (!currentResume) {
          throw new Error("Resumo não encontrado");
        }

        if (Object.keys(data).length > 0) {
          await tx.resume.update({
            where: { id: currentResume.id },
            data: data as any,
          });
        }

        const resume = await tx.resume.findUnique({
          where: { id: currentResume.id },
          include: RESUME_INCLUDE,
        });

        if (!resume || !resume.user) {
          throw new Error("Resumo não encontrado");
        }

        const completionScore = this.completionScoreService.calculate(
          resume,
          resume.user
        );

        if (resume.completion_score !== completionScore) {
          return tx.resume.update({
            where: { id: currentResume.id },
            data: { completion_score: completionScore },
            include: RESUME_INCLUDE,
          });
        }

        return resume;
      }
    );

    return updatedResume;
  }

  async getCompletionDetails(
    userId: string
  ): Promise<{
    total: number;
    filled: number;
    percentage: number;
    fields: Array<{ name: string; weight: number; filled: boolean }>;
  }> {
    const resume = await this.resumeRepository.findByUserId(userId);
    if (!resume || !resume.user) {
      throw new Error("Resumo não encontrado");
    }
    return this.completionScoreService.getDetails(resume, resume.user);
  }
}
