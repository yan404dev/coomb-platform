import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import * as FormData from "form-data";
import { AxiosError } from "axios";
import { CoombAIClientPort } from "./ai.types";
import { ChatMessage, ChatCompletionResult } from "./entities/ai.entity";

@Injectable()
export class CoombAIClientAdapter implements CoombAIClientPort {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.baseUrl =
      this.configService.get<string>("COOMB_AI_URL") ||
      this.configService.get<string>("PDF_SERVICE_URL") ||
      "http://localhost:8000";
  }

  async extractText(file: Buffer, filename: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file, {
      filename,
      contentType: filename.toLowerCase().endsWith(".pdf")
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    try {
      const response = await firstValueFrom(
        this.httpService.post<{ text: string }>(
          `${this.baseUrl}/api/v1/documents/extract-text`,
          formData,
          { headers: formData.getHeaders() }
        )
      );
      return response.data.text;
    } catch (error) {
      const axiosError = error as AxiosError<{ detail?: string }>;
      const msg =
        axiosError.response?.data?.detail || axiosError.message || "Erro";
      throw new Error(`Erro ao extrair texto: ${msg}`);
    }
  }

  async chatCompletion(
    messages: ChatMessage[],
    userId?: string | null,
    temperature: number = 0.7,
    maxTokens: number = 2000
  ): Promise<ChatCompletionResult> {
    const request = {
      messages,
      user_id: userId || null,
      temperature,
      max_tokens: maxTokens,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post<ChatCompletionResult>(
          `${this.baseUrl}/api/v1/chat/completion`,
          request
        )
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ detail?: string }>;
      const msg =
        axiosError.response?.data?.detail || axiosError.message || "Erro";
      throw new Error(`Erro no chat: ${msg}`);
    }
  }

  async generatePersonality(
    userId?: string | null,
    userData?: {
      professional_summary?: string | null;
      career_goals?: string | null;
      experiences?: unknown[];
      skills?: unknown[];
    }
  ) {
    const request = {
      user_id: userId || null,
      user_data: userData || null,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post<{
          personality: {
            executor: number;
            comunicador: number;
            planejador: number;
            analista: number;
            description?: string;
          };
          timestamp: string;
        }>(`${this.baseUrl}/api/v1/personality/generate`, request)
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ detail?: string }>;
      const msg =
        axiosError.response?.data?.detail || axiosError.message || "Erro";
      throw new Error(`Erro ao gerar personalidade: ${msg}`);
    }
  }
}
