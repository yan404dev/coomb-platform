export interface FileAttachment {
  name: string;
  size: number;
  type: string;
}

export interface Citation {
  url: string;
}

export interface ChatBubbleProps {
  content: string;
  timestamp: string | Date;
  isUser: boolean;
  isStreaming?: boolean;
  pdfUrl?: string;
  citations?: Citation[];
  fileAttachment?: FileAttachment;
  hideTimestamp?: boolean;
}
