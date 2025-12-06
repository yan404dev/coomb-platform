import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom, Observable } from "rxjs";
import {
  LLMProvider,
  LLMMessage,
  LLMCompletionOptions,
  LLMCompletionResponse,
  LLMStreamChunk,
} from "../../domain/ports/llm-provider.interface";
import { LLMConfig } from "../../domain/value-objects/llm-config.value-object";

@Injectable()
export class PerplexityProvider implements LLMProvider {
  private readonly config: LLMConfig;
  private readonly baseUrl = "https://api.perplexity.ai";

  constructor(private readonly httpService: HttpService) {
    this.config = LLMConfig.fromEnv();
  }

  isConfigured(): boolean {
    return !!this.config.apiKey;
  }

  async complete(
    messages: LLMMessage[],
    options?: LLMCompletionOptions
  ): Promise<LLMCompletionResponse> {
    if (!this.isConfigured()) {
      throw new Error("Perplexity client não está configurado");
    }

    try {
      // Build request body, only including optional params if they're defined
      const requestBody: any = {
        model: this.config.model,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: options?.temperature ?? this.config.temperature,
        max_tokens: options?.maxTokens ?? this.config.maxTokens,
      };

      // Only add optional parameters if they're defined
      if (options?.topP !== undefined) {
        requestBody.top_p = options.topP;
      }
      if (options?.frequencyPenalty !== undefined) {
        requestBody.frequency_penalty = options.frequencyPenalty;
      }
      if (options?.presencePenalty !== undefined) {
        requestBody.presence_penalty = options.presencePenalty;
      }

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/chat/completions`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${this.config.apiKey}`,
              "Content-Type": "application/json",
            },
          }
        )
      );

      const data = response.data;
      const content = data.choices?.[0]?.message?.content || "";
      const usage = data.usage
        ? {
            promptTokens: data.usage.prompt_tokens || 0,
            completionTokens: data.usage.completion_tokens || 0,
            totalTokens: data.usage.total_tokens || 0,
          }
        : undefined;

      // Captura citações se disponíveis
      const citations = data.citations?.map((citation: string) => ({
        url: citation,
      })) || [];

      return {
        content,
        usage,
        citations: citations.length > 0 ? citations : undefined,
      };
    } catch (error: any) {
      // Log detalhado do erro para debug
      console.error("Erro Perplexity (complete) - Detalhes completos:", {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        message: error?.message,
        requestUrl: error?.config?.url,
        requestData: error?.config?.data,
      });

      const errorMessage =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Erro desconhecido na API Perplexity";
      throw new Error(`Erro ao chamar Perplexity: ${errorMessage}`);
    }
  }

  completeStream(
    messages: LLMMessage[],
    options?: LLMCompletionOptions
  ): Observable<LLMStreamChunk> {
    if (!this.isConfigured()) {
      throw new Error("Perplexity client não está configurado");
    }

    return new Observable<LLMStreamChunk>((observer) => {
      const axios = this.httpService.axiosRef;

      // Build request body, only including optional params if they're defined
      const requestBody: any = {
        model: this.config.model,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: options?.temperature ?? this.config.temperature,
        max_tokens: options?.maxTokens ?? this.config.maxTokens,
        stream: true,
      };

      // Only add optional parameters if they're defined
      if (options?.topP !== undefined) {
        requestBody.top_p = options.topP;
      }
      if (options?.frequencyPenalty !== undefined) {
        requestBody.frequency_penalty = options.frequencyPenalty;
      }
      if (options?.presencePenalty !== undefined) {
        requestBody.presence_penalty = options.presencePenalty;
      }

      axios
        .post(
          `${this.baseUrl}/chat/completions`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${this.config.apiKey}`,
              "Content-Type": "application/json",
            },
            responseType: "stream",
          }
        )
        .then((response) => {
          const stream = response.data;
          let buffer = "";
          let collectedCitations: string[] = [];

          stream.on("data", (chunk: Buffer) => {
            buffer += chunk.toString();
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();

              if (!trimmed || trimmed.startsWith(":")) {
                continue;
              }

              if (trimmed.startsWith("data: ")) {
                const data = trimmed.substring(6);

                if (data === "[DONE]") {
                  observer.next({
                    content: "",
                    isComplete: true,
                    citations: collectedCitations.length > 0
                      ? collectedCitations.map(url => ({ url }))
                      : undefined,
                  });
                  observer.complete();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  const delta = parsed.choices?.[0]?.delta?.content;

                  // Captura citações se disponíveis
                  if (parsed.citations && Array.isArray(parsed.citations)) {
                    collectedCitations = parsed.citations;
                  }

                  if (delta) {
                    observer.next({
                      content: delta,
                      isComplete: false,
                    });
                  }

                  const finishReason = parsed.choices?.[0]?.finish_reason;
                  if (finishReason === "stop") {
                    const citations = collectedCitations.length > 0
                      ? collectedCitations.map(url => ({ url }))
                      : undefined;

                    observer.next({
                      content: "",
                      isComplete: true,
                      usage: parsed.usage ? {
                        promptTokens: parsed.usage.prompt_tokens ?? 0,
                        completionTokens: parsed.usage.completion_tokens ?? 0,
                        totalTokens: parsed.usage.total_tokens ?? 0,
                      } : undefined,
                      citations,
                    });
                  }
                } catch (parseError) {
                  console.warn("Erro ao parsear chunk SSE:", parseError);
                }
              }
            }
          });

          stream.on("end", () => {
            if (!observer.closed) {
              observer.next({
                content: "",
                isComplete: true,
              });
              observer.complete();
            }
          });

          stream.on("error", (error: any) => {
            observer.error(
              new Error(`Erro no stream Perplexity: ${error.message}`)
            );
          });
        })
        .catch((error: any) => {
          // Log detalhado do erro para debug
          console.error("Erro Perplexity - Detalhes completos:", {
            status: error?.response?.status,
            statusText: error?.response?.statusText,
            data: error?.response?.data,
            message: error?.message,
            requestUrl: error?.config?.url,
            requestData: error?.config?.data,
          });

          const errorMessage =
            error?.response?.data?.error?.message ||
            error?.response?.data?.message ||
            error?.message ||
            "Erro desconhecido na API Perplexity";
          observer.error(new Error(`Erro ao chamar Perplexity: ${errorMessage}`));
        });

      return () => {};
    });
  }
}
