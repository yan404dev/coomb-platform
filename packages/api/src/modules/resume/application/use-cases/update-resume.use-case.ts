import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { Resume } from "@prisma/client";
import { ResumeRepositoryPort } from "../../domain/ports/resume.repository.port";
import { UpdateResumeDto } from "../../dtos/update-resume.dto";
import { INJECTION_TOKENS } from "../../../../common/constants/injection-tokens";

export interface UpdateResumeRequest {
  userId: string;
  data: UpdateResumeDto;
}

@Injectable()
export class UpdateResumeUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.RESUME_REPOSITORY_PORT)
    private readonly repository: ResumeRepositoryPort
  ) {}

  async execute(request: UpdateResumeRequest): Promise<Resume> {
    const existingResume = await this.repository.findByUserId(request.userId);

    if (!existingResume) {
      throw new NotFoundException("Resumo não encontrado");
    }

    return this.repository.update(request.userId, request.data);
  }
}
