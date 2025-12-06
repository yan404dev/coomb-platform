import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { ResumeEntity } from "../../entities/resume.entity";
import { UpdateResumeDto } from "../../dtos/update-resume.dto";
import { CreateResumeUseCase } from "../use-cases/create-resume.use-case";
import { GetResumeUseCase } from "../use-cases/get-resume.use-case";
import { UpdateResumeUseCase } from "../use-cases/update-resume.use-case";
import { ResumeRepositoryPort } from "../../domain/ports/resume.repository.port";

@Injectable()
export class ResumeService {
  constructor(
    private readonly createResumeUseCase: CreateResumeUseCase,
    private readonly getResumeUseCase: GetResumeUseCase,
    private readonly updateResumeUseCase: UpdateResumeUseCase,
    @Inject("RESUME_REPOSITORY_PORT")
    private readonly repository: ResumeRepositoryPort
  ) {}

  async createResume(userId: string): Promise<ResumeEntity> {
    return this.createResumeUseCase.execute({ userId });
  }

  async findUserResume(userId: string): Promise<ResumeEntity> {
    return this.getResumeUseCase.execute({ userId });
  }

  async updateResume(userId: string, data: UpdateResumeDto): Promise<ResumeEntity> {
    return this.updateResumeUseCase.execute({ userId, data });
  }

  async findById(resumeId: string, userId: string): Promise<ResumeEntity> {
    const resume = await this.repository.findById(resumeId, userId);
    if (!resume) {
      throw new NotFoundException("Resumo não encontrado");
    }
    return resume;
  }

  async getCompletionDetails(userId: string) {
    return this.repository.getCompletionDetails(userId);
  }
}

