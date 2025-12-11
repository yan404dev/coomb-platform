export interface ChatContext {
  resumeId?: string;
  jobDescription?: string;
  optimizationStage?: "initial" | "analyzing" | "optimizing" | "complete";
  userPreferences?: Record<string, any>;
}

export interface Chat {
  id: string;
  userId: string | null;
  resumeId: string | null;
  sessionId: string | null;
  title: string;
  messageCount: number;
  lastMessageAt: Date;
  contextData: ChatContext | null;
  lastError: string | null;
  totalTokens: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
