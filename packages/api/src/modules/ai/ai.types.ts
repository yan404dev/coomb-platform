import { ChatMessage, ChatCompletionResult, PersonalityProfile } from "./entities/ai.entity";

export interface CoombAIClientPort {
  extractText(file: Buffer, filename: string): Promise<string>;

  chatCompletion(
    messages: ChatMessage[],
    userId?: string | null,
    temperature?: number,
    maxTokens?: number
  ): Promise<ChatCompletionResult>;

  generatePersonality(
    userId?: string | null,
    userData?: {
      professional_summary?: string | null;
      career_goals?: string | null;
      experiences?: unknown[];
      skills?: unknown[];
    }
  ): Promise<{
    personality: PersonalityProfile;
    timestamp: string;
  }>;
}
