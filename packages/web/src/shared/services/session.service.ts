import { api } from "@/shared/lib/api";

const baseURL = "/api/v1/sessions";

export interface AnonymousSession {
  sessionId: string;
  expiresAt: string;
  message: string;
}

export interface TransferSessionResponse {
  chatId: string | null;
  message: string;
}

export const sessionService = {
  createAnonymous: async (
    source: string = "web"
  ): Promise<AnonymousSession> => {
    const response = await api.post<AnonymousSession>(`${baseURL}/anonymous`, {
      source,
    });
    return response.data;
  },

  transfer: async (sessionId: string): Promise<TransferSessionResponse> => {
    const response = await api.post<TransferSessionResponse>(
      `${baseURL}/transfer`,
      { sessionId }
    );
    return response.data;
  },

  get: async (sessionId: string) => {
    const response = await api.get(`${baseURL}/${sessionId}`);
    return response.data;
  },
};
