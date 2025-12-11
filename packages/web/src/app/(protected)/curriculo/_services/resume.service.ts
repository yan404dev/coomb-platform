import type {
  Resume,
  Experience,
  Skill,
  Language,
  Education,
  Certification,
} from "@/shared/entities";
import { api } from "@/shared/lib/api";

export interface UpdateResumePayload {
  experiences?: Omit<Experience, "id" | "createdAt" | "updatedAt">[];
  skills?: Omit<Skill, "id" | "createdAt" | "updatedAt">[];
  languages?: Omit<Language, "id" | "createdAt" | "updatedAt">[];
  educations?: Omit<Education, "id" | "createdAt" | "updatedAt">[];
  certifications?: Omit<Certification, "id" | "createdAt" | "updatedAt">[];
}

const baseURL = "/api/v1/resume";

export const resumeService = {
  async get(): Promise<Resume> {
    const response = await api.get<Resume>(baseURL);
    return response.data;
  },

  async create(): Promise<Resume> {
    const response = await api.post<Resume>(baseURL);
    return response.data;
  },

  async update(data: UpdateResumePayload): Promise<Resume> {
    const response = await api.patch<Resume>(baseURL, data);
    return response.data;
  },

  async getCompletionDetails() {
    const response = await api.get(`${baseURL}/completion-details`);
    return response.data;
  },
};
