import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom, Observable } from "rxjs";
import {
  LLMCompletionOptions,
  LLMCompletionResponse,
  LLMMessage,
  LLMProvider,
  LLMStreamChunk,
} from "../../domain/ports/llm-provider.interface";
import { LLMConfig } from "../../domain/value-objects/llm-config.value-object";

@Injectable()
export class OpenAIProvider implements LLMProvider {
  private readonly config: LLMConfig;
  private readonly baseUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.config = LLMConfig.fromEnv();
    this.baseUrl = this.config.baseUrl ?? "https://api.openai.com/v1";
  }

  isConfigured(): boolean {
    return !!this.config.apiKey;
  }

  async complete(
    messages: LLMMessage[],
    options?: LLMCompletionOptions
  ): Promise<LLMCompletionResponse> {
    if (!this.isConfigured()) {
      throw new Error("OpenAI client não está configurado");
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/chat/completions`,
          {
            model: this.config.model,
            messages: messages.map((message) => ({
              role: message.role,
              content: message.content,
            })),
            temperature: options?.temperature ?? this.config.temperature,
            max_tokens: options?.maxTokens ?? this.config.maxTokens,
            top_p: options?.topP,
            frequency_penalty: options?.frequencyPenalty,
            presence_penalty: options?.presencePenalty,
          },
          {
            headers: {
              Authorization: `Bearer ${this.config.apiKey}`,
              "Content-Type": "application/json",
            },
          }
        )
      );

      const data = response.data;
      const content = data.choices?.[0]?.message?.content ?? "";
      const usage = data.usage
        ? {
            promptTokens: data.usage.prompt_tokens ?? 0,
            completionTokens: data.usage.completion_tokens ?? 0,
            totalTokens: data.usage.total_tokens ?? 0,
          }
        : undefined;

      return {
        content,
        usage,
      };
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error?.message ||
        error?.message ||
        "Erro desconhecido na API OpenAI";
      throw new Error(`Erro ao chamar OpenAI: ${errorMessage}`);
    }
  }

  completeStream(
    messages: LLMMessage[],
    options?: LLMCompletionOptions
  ): Observable<LLMStreamChunk> {
    if (!this.isConfigured()) {
      throw new Error("OpenAI client não está configurado");
    }

    return new Observable<LLMStreamChunk>((observer) => {
      const axios = this.httpService.axiosRef;

      axios
        .post(
          `${this.baseUrl}/chat/completions`,
          {
            model: this.config.model,
            messages: messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            temperature: options?.temperature ?? this.config.temperature,
            max_tokens: options?.maxTokens ?? this.config.maxTokens,
            top_p: options?.topP,
            frequency_penalty: options?.frequencyPenalty,
            presence_penalty: options?.presencePenalty,
            stream: true,
          },
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
                  });
                  observer.complete();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  const delta = parsed.choices?.[0]?.delta?.content;

                  if (delta) {
                    observer.next({
                      content: delta,
                      isComplete: false,
                    });
                  }

                  const finishReason = parsed.choices?.[0]?.finish_reason;
                  if (finishReason === "stop" && parsed.usage) {
                    observer.next({
                      content: "",
                      isComplete: true,
                      usage: {
                        promptTokens: parsed.usage.prompt_tokens ?? 0,
                        completionTokens: parsed.usage.completion_tokens ?? 0,
                        totalTokens: parsed.usage.total_tokens ?? 0,
                      },
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
              new Error(`Erro no stream OpenAI: ${error.message}`)
            );
          });
        })
        .catch((error: any) => {
          const errorMessage =
            error?.response?.data?.error?.message ||
            error?.message ||
            "Erro desconhecido na API OpenAI";
          observer.error(new Error(`Erro ao chamar OpenAI: ${errorMessage}`));
        });

      return () => {};
    });
  }
}
