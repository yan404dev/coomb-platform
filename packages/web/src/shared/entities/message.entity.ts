export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}

export enum MessageContentType {
  TEXT = "text",
  PDF_ATTACHMENT = "pdf_attachment",
  JOB_DESCRIPTION = "job_description",
  RESUME_ANALYSIS = "resume_analysis",
  OPTIMIZATION_RESULT = "optimization_result",
}

export interface Citation {
  url: string;
  title?: string;
  relevance_score?: number;
}

export interface MessageMetadata {
  attachment_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  processing_time_ms?: number;
  error_details?: string;
}

export interface Message {
  id: string;
  chatId: string;
  role: MessageRole;
  messageType: MessageContentType;
  content: string;
  pdfUrl: string | null;
  citations: Citation[] | null;
  metadata: MessageMetadata | null;
  tokensUsed: number | null;
  model: string | null;
  createdAt: Date;
  updatedAt: Date;
}
