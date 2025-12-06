import { Observable } from "rxjs";
import { Resume, User } from "@prisma/client";

export interface OptimizationResult {
  optimized_resume: {
    candidate_name: string;
    email: string;
    professional_summary: string;
    experiences: Array<{
      company: string;
      position: string;
      description: string;
      achievements: string[];
      start_date: string;
      end_date?: string;
      current: boolean;
    }>;
    skills: string[];
    keywords_matched: string[];
  };
  ats_score_before: number;
  ats_score_after: number;
  improvements: string[];
  pdf_url?: string;
}

export interface PDFGenerationResult {
  filename: string;
  download_url: string;
  template_used: string;
}

export interface TextExtractionResult {
  text: string;
  length: number;
  filename: string;
  source_type: string;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionResult {
  content: string;
  model: string;
  tokens_used: number;
}

export interface ChatStreamChunk {
  content: string;
  is_complete: boolean;
  citations?: Array<{ url: string }>;
}

export interface PersonalityProfile {
  executor: number;
  comunicador: number;
  planejador: number;
  analista: number;
  description?: string;
}

export interface GeneratePersonalityResult {
  personality: PersonalityProfile;
  timestamp: string;
}

export interface CoombAIClientPort {
  optimizeResume(
    resume: Resume,
    userProfile: User,
    jobDescription: string,
    generatePdf?: boolean
  ): Promise<OptimizationResult>;

  generatePDF(resume: Resume, userProfile: User): Promise<PDFGenerationResult>;

  extractText(file: Buffer, filename: string): Promise<string>;

  chatCompletion(
    messages: ChatMessage[],
    userId?: string | null,
    temperature?: number,
    maxTokens?: number
  ): Promise<ChatCompletionResult>;

  chatStream(
    messages: ChatMessage[],
    userId?: string | null,
    temperature?: number,
    maxTokens?: number
  ): Promise<Observable<ChatStreamChunk>>;

  generatePersonality(
    userId?: string | null,
    userData?: {
      professional_summary?: string | null;
      career_goals?: string | null;
      experiences?: unknown[];
      skills?: unknown[];
    }
  ): Promise<GeneratePersonalityResult>;
}
