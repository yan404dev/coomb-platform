import { Injectable, Inject } from "@nestjs/common";
import { GeneratedResume } from "@prisma/client";
import { CreateGeneratedResumeDto } from "../../dto/create-generated-resume.dto";
import { UpdateGeneratedResumeDto } from "../../dto/update-generated-resume.dto";
import { GeneratedResumeRepositoryPort } from "../../domain/ports/generated-resume.repository.port";
import { INJECTION_TOKENS } from "../../../../common/constants/injection-tokens";

@Injectable()
export class GeneratedResumeService {
  constructor(
    @Inject(INJECTION_TOKENS.GENERATED_RESUME_REPOSITORY_PORT)
    private readonly repository: GeneratedResumeRepositoryPort
  ) {}

  async create(
    userId: string,
    createGeneratedResumeDto: CreateGeneratedResumeDto
  ): Promise<{ id: string; title: string; createdAt: Date }> {
    const entity = await this.repository.create(
      userId,
      createGeneratedResumeDto
    );
    return {
      id: entity.id,
      title: entity.title,
      createdAt: entity.created_at,
    };
  }

  async findAll(
    userId: string,
    baseResumeId?: string
  ): Promise<GeneratedResume[]> {
    return this.repository.findAll(userId, baseResumeId);
  }

  async findOne(id: string, userId: string): Promise<GeneratedResume> {
    return this.repository.findById(id, userId);
  }

  async update(
    id: string,
    userId: string,
    updateGeneratedResumeDto: UpdateGeneratedResumeDto
  ): Promise<GeneratedResume> {
    return this.repository.update(id, userId, updateGeneratedResumeDto);
  }

  async delete(id: string, userId: string): Promise<void> {
    return this.repository.delete(id, userId);
  }
}
