import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { Resume } from "@prisma/client";
import { UpdateResumeDto } from "../../dtos/update-resume.dto";
import { CreateResumeUseCase } from "../use-cases/create-resume.use-case";
import { GetResumeUseCase } from "../use-cases/get-resume.use-case";
import { UpdateResumeUseCase } from "../use-cases/update-resume.use-case";
import { ResumeRepositoryPort } from "../../domain/ports/resume.repository.port";
import { INJECTION_TOKENS } from "../../../../common/constants/injection-tokens";

@Injectable()
export class ResumeService {
  constructor(
    private readonly createResumeUseCase: CreateResumeUseCase,
    private readonly getResumeUseCase: GetResumeUseCase,
    private readonly updateResumeUseCase: UpdateResumeUseCase,
    @Inject(INJECTION_TOKENS.RESUME_REPOSITORY_PORT)
    private readonly repository: ResumeRepositoryPort
  ) {}

  async createResume(userId: string): Promise<Resume> {
    return this.createResumeUseCase.execute({ userId });
  }

  async findUserResume(userId: string): Promise<Resume> {
    return this.getResumeUseCase.execute({ userId });
  }

  async updateResume(userId: string, data: UpdateResumeDto): Promise<Resume> {
    return this.updateResumeUseCase.execute({ userId, data });
  }

  async findById(resumeId: string, userId: string): Promise<Resume> {
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
