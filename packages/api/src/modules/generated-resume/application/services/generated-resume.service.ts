import { Injectable, Inject } from "@nestjs/common";
import { GeneratedResumeEntity } from "../../entities/generated-resume.entity";
import { CreateGeneratedResumeDto } from "../../dto/create-generated-resume.dto";
import { UpdateGeneratedResumeDto } from "../../dto/update-generated-resume.dto";
import { GeneratedResumeRepositoryPort } from "../domain/ports/generated-resume.repository.port";

@Injectable()
export class GeneratedResumeService {
  constructor(
    @Inject("GENERATED_RESUME_REPOSITORY_PORT")
    private readonly repository: GeneratedResumeRepositoryPort
  ) {}

  async create(userId: string, createGeneratedResumeDto: CreateGeneratedResumeDto): Promise<any> {
    const entity = await this.repository.create(userId, createGeneratedResumeDto);
    return {
      id: entity.id,
      title: entity.title,
      createdAt: entity.created_at,
    };
  }

  async findAll(userId: string, baseResumeId?: string): Promise<GeneratedResumeEntity[]> {
    return this.repository.findAll(userId, baseResumeId);
  }

  async findOne(id: string, userId: string): Promise<GeneratedResumeEntity> {
    return this.repository.findById(id, userId);
  }

  async update(
    id: string,
    userId: string,
    updateGeneratedResumeDto: UpdateGeneratedResumeDto
  ): Promise<GeneratedResumeEntity> {
    return this.repository.update(id, userId, updateGeneratedResumeDto);
  }

  async delete(id: string, userId: string): Promise<void> {
    return this.repository.delete(id, userId);
  }
}

