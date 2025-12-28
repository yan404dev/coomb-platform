export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionResult {
  content: string;
  model: string;
  tokens_used: number;
  pdf_url?: string;
}

export interface PersonalityProfile {
  executor: number;
  comunicador: number;
  planejador: number;
  analista: number;
  description?: string;
}
