import { ResumeEntity } from "../entities/resume.entity";
import { UpdateResumeDto } from "../../dtos/update-resume.dto";

export interface ResumeRepositoryPort {
  findByUserId(userId: string): Promise<ResumeEntity | null>;
  findById(resumeId: string, userId: string): Promise<ResumeEntity | null>;
  create(userId: string): Promise<ResumeEntity>;
  update(userId: string, data: UpdateResumeDto): Promise<ResumeEntity>;
  getCompletionDetails(userId: string): Promise<any>;
}

