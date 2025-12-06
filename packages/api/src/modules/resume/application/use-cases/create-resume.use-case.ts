import { Injectable, Inject } from "@nestjs/common";
import { Resume } from "@prisma/client";
import { ResumeRepositoryPort } from "../../domain/ports/resume.repository.port";
import { INJECTION_TOKENS } from "../../../../common/constants/injection-tokens";

export interface CreateResumeRequest {
  userId: string;
}

@Injectable()
export class CreateResumeUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.RESUME_REPOSITORY_PORT)
    private readonly repository: ResumeRepositoryPort
  ) {}

  async execute(request: CreateResumeRequest): Promise<Resume> {
    return this.repository.create(request.userId);
  }
}
