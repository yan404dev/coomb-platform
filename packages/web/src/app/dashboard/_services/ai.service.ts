import { api } from "@/shared/lib/api";
import type { PersonalityProfile, ImportedResumeData } from "@/shared/types";

export interface GeneratePersonalityResponse {
  personality: PersonalityProfile;
  timestamp: string;
}

export interface ImportResumeResponse {
  data: ImportedResumeData;
  timestamp: string;
}

export const aiService = {
  generatePersonality: async (): Promise<PersonalityProfile> => {
    const response = await api.post<GeneratePersonalityResponse>(
      "/api/v1/ai/generate-personality"
    );
    return response.data.personality;
  },

  importResume: async (file: File): Promise<ImportedResumeData> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<{ chatId: string; data?: ImportedResumeData }>(
      "/api/v1/chats/upload-resume",
      formData
    );

    if (!response.data.data) {
      throw new Error("Erro ao importar currículo: dados não retornados");
    }

    return response.data.data;
  },
};
