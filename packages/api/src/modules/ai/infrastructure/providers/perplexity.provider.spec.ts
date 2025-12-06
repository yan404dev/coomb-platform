import { HttpService } from "@nestjs/axios";
import { PerplexityProvider } from "./perplexity.provider";
import { LLMMessage } from "../../domain/ports/llm-provider.interface";
import { of, throwError } from "rxjs";

describe("PerplexityProvider", () => {
  let provider: PerplexityProvider;
  let httpService: jest.Mocked<HttpService>;

  beforeEach(() => {
    httpService = {
      post: jest.fn(),
    } as any;

    // Configurar variáveis de ambiente para teste
    process.env.LLM_PROVIDER = "perplexity";
    process.env.LLM_API_KEY = "test-api-key";
    process.env.LLM_MODEL = "llama-3.1-sonar-large-128k-online";
    process.env.LLM_TEMPERATURE = "0.7";
    process.env.LLM_MAX_TOKENS = "2000";

    provider = new PerplexityProvider(httpService);
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
      process.env.LLM_API_KEY = "test-key";
      provider = new PerplexityProvider(httpService);
      expect(provider.isConfigured()).toBe(true);
    });

    it("deve retornar false quando API key não está configurada", () => {
      // Para testar sem API key, precisamos criar um provider mockado
      // ou simplesmente testar que quando apiKey está vazia, isConfigured retorna false
      const mockConfig = {
        apiKey: "",
        model: "test-model",
        provider: "perplexity",
        temperature: 0.7,
        maxTokens: 2000,
      };

      // Criar provider com config mockada
      const providerWithoutKey = Object.create(PerplexityProvider.prototype);
      providerWithoutKey.config = mockConfig;
      providerWithoutKey.httpService = httpService;
      providerWithoutKey.baseUrl = "https://api.perplexity.ai";

      expect(providerWithoutKey.isConfigured()).toBe(false);
    });
  });

  describe("complete", () => {
    beforeEach(() => {
      process.env.LLM_API_KEY = "test-key";
      provider = new PerplexityProvider(httpService);
    });

    it("deve chamar a API Perplexity e retornar resposta", async () => {
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: "Esta é uma resposta de teste",
              },
            },
          ],
          usage: {
            prompt_tokens: 10,
            completion_tokens: 15,
            total_tokens: 25,
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

      expect(result.content).toBe("Esta é uma resposta de teste");
      expect(result.usage).toEqual({
        promptTokens: 10,
        completionTokens: 15,
        totalTokens: 25,
      });
      expect(httpService.post).toHaveBeenCalledWith(
        expect.stringContaining("/chat/completions"),
        expect.objectContaining({
          model: expect.any(String),
          messages: expect.any(Array),
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining("Bearer"),
          }),
        })
      );
    });

    it("deve usar opções personalizadas quando fornecidas", async () => {
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: "Resposta",
              },
            },
          ],
        },
      };

      httpService.post.mockReturnValue(of(mockResponse) as any);

      await provider.complete([{ role: "user", content: "Teste" }], {
        temperature: 0.5,
        maxTokens: 1000,
      });

      expect(httpService.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          temperature: 0.5,
          max_tokens: 1000,
        }),
        expect.any(Object)
      );
    });

    it("deve lançar erro se o cliente não estiver configurado", async () => {
      // Criar provider com config mockada sem API key
      const providerWithoutKey = Object.create(PerplexityProvider.prototype);
      providerWithoutKey.config = {
        apiKey: "",
        model: "test-model",
        provider: "perplexity",
        temperature: 0.7,
        maxTokens: 2000,
      };
      providerWithoutKey.httpService = httpService;
      providerWithoutKey.baseUrl = "https://api.perplexity.ai";

      await expect(
        providerWithoutKey.complete([{ role: "user", content: "teste" }])
      ).rejects.toThrow("Perplexity client não está configurado");
    });

    it("deve propagar erros da API Perplexity", async () => {
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
      ).rejects.toThrow("Erro ao chamar Perplexity: API Error");
    });
  });
});
