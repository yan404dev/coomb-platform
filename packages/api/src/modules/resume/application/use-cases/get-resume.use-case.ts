import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { ResumeRepositoryPort } from "../../domain/ports/resume.repository.port";
import { ResumeEntity } from "../../entities/resume.entity";

export interface GetResumeRequest {
  userId: string;
}

@Injectable()
export class GetResumeUseCase {
  constructor(
    @Inject("RESUME_REPOSITORY_PORT")
    private readonly repository: ResumeRepositoryPort
  ) {}

  async execute(request: GetResumeRequest): Promise<ResumeEntity> {
    let resume = await this.repository.findByUserId(request.userId);

    if (!resume) {
      resume = await this.repository.create(request.userId);
    }

    return resume;
  }
}

