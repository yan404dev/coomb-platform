import { api } from "@/lib/api";
import type {
  Message,
  CreateMessageDto,
  SearchMessagesDto,
} from "@/entities/message.entity";

const baseURL = "/api/v1/chats";

export interface CreateMessageResponse extends Message {
  chatId?: string;
}

export interface UploadResumeDto {
  fileName: string;
  jobDescription?: string;
}

export const messageService = {
  create: async (
    chatId: string | null | undefined,
    dto: CreateMessageDto
  ): Promise<CreateMessageResponse> => {
    const endpoint = chatId
      ? `${baseURL}/${chatId}/messages`
      : `${baseURL}/messages`;
    const response = await api.post<CreateMessageResponse>(endpoint, dto);
    return response.data;
  },

  uploadResume: async (
    chatId: string | null | undefined,
    file: File,
    jobDescription?: string,
    sessionId?: string
  ): Promise<{ chatId: string }> => {
    const endpoint = chatId
      ? `${baseURL}/${chatId}/upload-resume`
      : `${baseURL}/upload-resume`;

    const formData = new FormData();
    formData.append("file", file);
    if (jobDescription) {
      formData.append("jobDescription", jobDescription);
    }
    if (sessionId) {
      formData.append("sessionId", sessionId);
    }

    const response = await api.post<{ chatId: string }>(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  list: async (chatId: string): Promise<Message[]> => {
    const response = await api.get<Message[]>(`${baseURL}/${chatId}/messages`);
    return response.data;
  },

  search: async (
    chatId: string,
    dto: SearchMessagesDto
  ): Promise<Message[]> => {
    const response = await api.post<Message[]>(
      `${baseURL}/${chatId}/messages/search`,
      dto
    );
    return response.data;
  },

  async *createWithStream(
    chatId: string | null | undefined,
    dto: CreateMessageDto
  ): AsyncGenerator<{
    chunk: string;
    messageId: string;
    chatId: string;
    isComplete: boolean;
    citations?: Array<{ url: string }>;
  }> {
    const endpoint = chatId
      ? `${baseURL}/${chatId}/messages/stream`
      : `${baseURL}/new/messages/stream`;

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
      }${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(dto),
      }
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let messageId = "";
    let resultChatId = "";
    let citations: Array<{ url: string }> | undefined;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim() || !line.startsWith("data: ")) continue;

          const data = JSON.parse(line.slice(6));
          if (data.messageId) messageId = data.messageId;
          if (data.chatId) resultChatId = data.chatId;
          if (data.citations) citations = data.citations;

          if (data.chunk && messageId && resultChatId) {
            yield {
              chunk: data.chunk,
              messageId,
              chatId: resultChatId,
              isComplete: false,
            };
          }
        }
      }

      if (messageId && resultChatId) {
        yield {
          chunk: "",
          messageId,
          chatId: resultChatId,
          isComplete: true,
          citations,
        };
      }
    } finally {
      reader.releaseLock();
    }
  },
};
