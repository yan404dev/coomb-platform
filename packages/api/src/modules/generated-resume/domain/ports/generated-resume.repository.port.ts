import { GeneratedResume } from "@prisma/client";
import { CreateGeneratedResumeDto } from "../../dto/create-generated-resume.dto";
import { UpdateGeneratedResumeDto } from "../../dto/update-generated-resume.dto";

export interface GeneratedResumeRepositoryPort {
  create(userId: string, data: CreateGeneratedResumeDto): Promise<GeneratedResume>;
  findAll(userId: string, baseResumeId?: string): Promise<GeneratedResume[]>;
  findById(id: string, userId: string): Promise<GeneratedResume>;
  update(id: string, userId: string, data: UpdateGeneratedResumeDto): Promise<GeneratedResume>;
  delete(id: string, userId: string): Promise<void>;
}

