import { Provider } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { LLMProvider } from "../../domain/ports/llm-provider.interface";
import { LLMProviderType } from "../../domain/value-objects/llm-config.value-object";
import { PerplexityProvider } from "./perplexity.provider";
import { OpenAIProvider } from "./openai.provider";

export function createLLMProvider(): Provider {
  return {
    provide: "LLM_PROVIDER",
    useFactory: (httpService: HttpService): LLMProvider => {
      const providerType =
        (process.env.LLM_PROVIDER as LLMProviderType) || LLMProviderType.OPENAI;

      switch (providerType) {
        case LLMProviderType.OPENAI:
          return new OpenAIProvider(httpService);
        case LLMProviderType.PERPLEXITY:
          return new PerplexityProvider(httpService);

        default:
          console.warn(
            `Provedor LLM desconhecido: ${providerType}. Usando OpenAI.`
          );
          return new OpenAIProvider(httpService);
      }
    },
    inject: [HttpService],
  };
}
