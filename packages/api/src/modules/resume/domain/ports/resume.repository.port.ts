import { Resume } from "@prisma/client";
import { UpdateResumeDto } from "../../dtos/update-resume.dto";

export interface ResumeRepositoryPort {
  findByUserId(userId: string): Promise<Resume | null>;
  findById(resumeId: string, userId: string): Promise<Resume | null>;
  create(userId: string): Promise<Resume>;
  update(userId: string, data: UpdateResumeDto): Promise<Resume>;
  getCompletionDetails(userId: string): Promise<{ total: number; filled: number; percentage: number; fields: Array<{ name: string; weight: number; filled: boolean }> }>;
}

