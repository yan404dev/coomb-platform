import { GeneratedResumeEntity } from "../../entities/generated-resume.entity";
import { CreateGeneratedResumeDto } from "../../dto/create-generated-resume.dto";
import { UpdateGeneratedResumeDto } from "../../dto/update-generated-resume.dto";

export interface GeneratedResumeRepositoryPort {
  create(userId: string, data: CreateGeneratedResumeDto): Promise<GeneratedResumeEntity>;
  findAll(userId: string, baseResumeId?: string): Promise<GeneratedResumeEntity[]>;
  findById(id: string, userId: string): Promise<GeneratedResumeEntity>;
  update(id: string, userId: string, data: UpdateGeneratedResumeDto): Promise<GeneratedResumeEntity>;
  delete(id: string, userId: string): Promise<void>;
}

