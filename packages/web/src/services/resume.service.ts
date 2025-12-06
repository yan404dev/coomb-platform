import {
  ResumeEntity,
  Experience,
  Skill,
  Language,
  Education,
  Certification,
} from "@/entities";
import { api } from "@/lib/api";

export interface UpdateResumePayload {
  experiences?: Omit<Experience, "id">[];
  skills?: Omit<Skill, "id">[];
  languages?: Omit<Language, "id">[];
  educations?: Omit<Education, "id">[];
  certifications?: Omit<Certification, "id">[];
}

export interface CreateExperienceDto {
  position: string;
  company: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description?: string;
}

export interface UpdateExperienceDto {
  position?: string;
  company?: string;
  startDate?: string;
  endDate?: string | null;
  current?: boolean;
  description?: string;
}

export interface CreateSkillDto {
  name: string;
  level?: string;
}

export interface UpdateSkillDto {
  name?: string;
  level?: string;
}

export interface CreateLanguageDto {
  name: string;
  level: string;
}

export interface UpdateLanguageDto {
  name?: string;
  level?: string;
}

export interface CreateEducationDto {
  degree: string;
  institution: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
}

export interface UpdateEducationDto {
  degree?: string;
  institution?: string;
  startDate?: string;
  endDate?: string | null;
  current?: boolean;
}

export interface CreateCertificationDto {
  name: string;
  institution?: string;
  completionDate?: string;
}

export interface UpdateCertificationDto {
  name?: string;
  institution?: string;
  completionDate?: string;
}

const baseURL = "/api/v1/resume";

export const resumeService = {
  async get(): Promise<ResumeEntity> {
    const response = await api.get<ResumeEntity>(baseURL);
    return response.data;
  },

  async create(): Promise<ResumeEntity> {
    const response = await api.post<ResumeEntity>(baseURL);
    return response.data;
  },

  async update(data: UpdateResumePayload): Promise<ResumeEntity> {
    const response = await api.patch<ResumeEntity>(baseURL, data);
    return response.data;
  },

  async getCompletionDetails() {
    const response = await api.get(`${baseURL}/completion-details`);
    return response.data;
  },

  async addExperience(data: CreateExperienceDto): Promise<ResumeEntity> {
    const response = await api.post<ResumeEntity>(`${baseURL}/experiences`, data);
    return response.data;
  },

  async updateExperience(
    experienceId: string,
    data: UpdateExperienceDto
  ): Promise<ResumeEntity> {
    const response = await api.patch<ResumeEntity>(
      `${baseURL}/experiences/${experienceId}`,
      data
    );
    return response.data;
  },

  async deleteExperience(experienceId: string): Promise<ResumeEntity> {
    const response = await api.delete<ResumeEntity>(
      `${baseURL}/experiences/${experienceId}`
    );
    return response.data;
  },

  async addSkill(data: CreateSkillDto): Promise<ResumeEntity> {
    const response = await api.post<ResumeEntity>(`${baseURL}/skills`, data);
    return response.data;
  },

  async updateSkill(
    skillId: string,
    data: UpdateSkillDto
  ): Promise<ResumeEntity> {
    const response = await api.patch<ResumeEntity>(
      `${baseURL}/skills/${skillId}`,
      data
    );
    return response.data;
  },

  async deleteSkill(skillId: string): Promise<ResumeEntity> {
    const response = await api.delete<ResumeEntity>(
      `${baseURL}/skills/${skillId}`
    );
    return response.data;
  },

  async addLanguage(data: CreateLanguageDto): Promise<ResumeEntity> {
    const response = await api.post<ResumeEntity>(`${baseURL}/languages`, data);
    return response.data;
  },

  async updateLanguage(
    languageId: string,
    data: UpdateLanguageDto
  ): Promise<ResumeEntity> {
    const response = await api.patch<ResumeEntity>(
      `${baseURL}/languages/${languageId}`,
      data
    );
    return response.data;
  },

  async deleteLanguage(languageId: string): Promise<ResumeEntity> {
    const response = await api.delete<ResumeEntity>(
      `${baseURL}/languages/${languageId}`
    );
    return response.data;
  },

  async addEducation(data: CreateEducationDto): Promise<ResumeEntity> {
    const response = await api.post<ResumeEntity>(`${baseURL}/educations`, data);
    return response.data;
  },

  async updateEducation(
    educationId: string,
    data: UpdateEducationDto
  ): Promise<ResumeEntity> {
    const response = await api.patch<ResumeEntity>(
      `${baseURL}/educations/${educationId}`,
      data
    );
    return response.data;
  },

  async deleteEducation(educationId: string): Promise<ResumeEntity> {
    const response = await api.delete<ResumeEntity>(
      `${baseURL}/educations/${educationId}`
    );
    return response.data;
  },

  async addCertification(
    data: CreateCertificationDto
  ): Promise<ResumeEntity> {
    const response = await api.post<ResumeEntity>(
      `${baseURL}/certifications`,
      data
    );
    return response.data;
  },

  async updateCertification(
    certificationId: string,
    data: UpdateCertificationDto
  ): Promise<ResumeEntity> {
    const response = await api.patch<ResumeEntity>(
      `${baseURL}/certifications/${certificationId}`,
      data
    );
    return response.data;
  },

  async deleteCertification(certificationId: string): Promise<ResumeEntity> {
    const response = await api.delete<ResumeEntity>(
      `${baseURL}/certifications/${certificationId}`
    );
    return response.data;
  },
};
