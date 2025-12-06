import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { ResumeRepositoryPort } from "../../domain/ports/resume.repository.port";
import { ResumeEntity } from "../../entities/resume.entity";
import { UpdateResumeDto } from "../../dtos/update-resume.dto";

export interface UpdateResumeRequest {
  userId: string;
  data: UpdateResumeDto;
}

@Injectable()
export class UpdateResumeUseCase {
  constructor(
    @Inject("RESUME_REPOSITORY_PORT")
    private readonly repository: ResumeRepositoryPort
  ) {}

  async execute(request: UpdateResumeRequest): Promise<ResumeEntity> {
    const existingResume = await this.repository.findByUserId(request.userId);
    
    if (!existingResume) {
      throw new NotFoundException("Resumo não encontrado");
    }

    return this.repository.update(request.userId, request.data);
  }
}

