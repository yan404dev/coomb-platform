import { HttpService } from "@nestjs/axios";
import { of, throwError } from "rxjs";
import { OpenAIProvider } from "./openai.provider";
import { LLMMessage } from "../../domain/ports/llm-provider.interface";
import { LLMProviderType } from "../../domain/value-objects/llm-config.value-object";

describe("OpenAIProvider", () => {
  let provider: OpenAIProvider;
  let httpService: jest.Mocked<HttpService>;

  beforeEach(() => {
    httpService = {
      post: jest.fn(),
    } as any;

    process.env.LLM_PROVIDER = LLMProviderType.OPENAI;
    process.env.LLM_API_KEY = "test-api-key";
    process.env.LLM_MODEL = "gpt-4.1";
    process.env.LLM_TEMPERATURE = "0.7";
    process.env.LLM_MAX_TOKENS = "2000";

    provider = new OpenAIProvider(httpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.LLM_API_KEY;
    delete process.env.LLM_MODEL;
  });

  it("deve ser definido", () => {
    expect(provider).toBeDefined();
  });

  describe("isConfigured", () => {
    it("deve retornar true quando API key está configurada", () => {
      expect(provider.isConfigured()).toBe(true);
    });

    it("deve retornar false quando API key não está configurada", () => {
      const providerWithoutKey = Object.create(OpenAIProvider.prototype);
      providerWithoutKey.config = {
        apiKey: "",
        model: "gpt-4",
        provider: LLMProviderType.OPENAI,
        temperature: 0.7,
        maxTokens: 2000,
      };
      providerWithoutKey.baseUrl = "https://api.openai.com/v1";
      providerWithoutKey.httpService = httpService;

      expect(providerWithoutKey.isConfigured()).toBe(false);
    });
  });

  describe("complete", () => {
    it("deve chamar a API OpenAI e retornar resposta", async () => {
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: "Resposta de teste",
              },
            },
          ],
          usage: {
            prompt_tokens: 12,
            completion_tokens: 18,
            total_tokens: 30,
          },
        },
      };

      httpService.post.mockReturnValue(of(mockResponse) as any);

      const messages: LLMMessage[] = [
        {
          role: "user",
          content: "Olá",
        },
      ];

      const result = await provider.complete(messages);

      expect(httpService.post).toHaveBeenCalledWith(
        expect.stringContaining("/chat/completions"),
        expect.objectContaining({
          model: "gpt-4.1",
          messages: expect.any(Array),
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining("Bearer"),
          }),
        })
      );
      expect(result.content).toBe("Resposta de teste");
      expect(result.usage).toEqual({
        promptTokens: 12,
        completionTokens: 18,
        totalTokens: 30,
      });
    });

    it("deve usar opções personalizadas quando fornecidas", async () => {
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: "Resposta", // truncated
              },
            },
          ],
        },
      };

      httpService.post.mockReturnValue(of(mockResponse) as any);

      await provider.complete([{ role: "user", content: "Teste" }], {
        temperature: 0.3,
        maxTokens: 800,
      });

      expect(httpService.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          temperature: 0.3,
          max_tokens: 800,
        }),
        expect.any(Object)
      );
    });

    it("deve lançar erro se o cliente não estiver configurado", async () => {
      const providerWithoutKey = Object.create(OpenAIProvider.prototype);
      providerWithoutKey.config = {
        apiKey: "",
        model: "gpt-4",
        provider: LLMProviderType.OPENAI,
        temperature: 0.7,
        maxTokens: 2000,
      };
      providerWithoutKey.baseUrl = "https://api.openai.com/v1";
      providerWithoutKey.httpService = httpService;

      await expect(
        providerWithoutKey.complete([{ role: "user", content: "teste" }])
      ).rejects.toThrow("OpenAI client não está configurado");
    });

    it("deve propagar erros da API OpenAI", async () => {
      const errorResponse = {
        response: {
          data: {
            error: {
              message: "API Error",
            },
          },
        },
      };

      httpService.post.mockReturnValue(throwError(() => errorResponse) as any);

      await expect(
        provider.complete([{ role: "user", content: "teste" }])
      ).rejects.toThrow("Erro ao chamar OpenAI: API Error");
    });
  });
});
