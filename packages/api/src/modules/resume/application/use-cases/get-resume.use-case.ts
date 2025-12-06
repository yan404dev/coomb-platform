import { Injectable, Inject } from "@nestjs/common";
import { Resume } from "@prisma/client";
import { ResumeRepositoryPort } from "../../domain/ports/resume.repository.port";
import { INJECTION_TOKENS } from "../../../../common/constants/injection-tokens";

export interface GetResumeRequest {
  userId: string;
}

@Injectable()
export class GetResumeUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.RESUME_REPOSITORY_PORT)
    private readonly repository: ResumeRepositoryPort
  ) {}

  async execute(request: GetResumeRequest): Promise<Resume> {
    let resume = await this.repository.findByUserId(request.userId);

    if (!resume) {
      resume = await this.repository.create(request.userId);
    }

    return resume;
  }
}
