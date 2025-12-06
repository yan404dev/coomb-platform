import { Injectable, Inject } from "@nestjs/common";
import { ResumeRepositoryPort } from "../../domain/ports/resume.repository.port";
import { ResumeEntity } from "../../entities/resume.entity";

export interface CreateResumeRequest {
  userId: string;
}

@Injectable()
export class CreateResumeUseCase {
  constructor(
    @Inject("RESUME_REPOSITORY_PORT")
    private readonly repository: ResumeRepositoryPort
  ) {}

  async execute(request: CreateResumeRequest): Promise<ResumeEntity> {
    return this.repository.create(request.userId);
  }
}

