/**
 * Message Entity
 * Representa uma mensagem no sistema de chat
 */
export enum MessageType {
  USER = "user",
  ASSISTANT = "assistant",
}

export interface Message {
  id: string;
  chat_id: string;
  messageType: MessageType;
  content: string;
  pdf_url?: string | null;
  citations?: Array<{ url: string }> | null;
  created_at: string;
}

export interface CreateMessageDto {
  content: string;
  messageType: MessageType;
  pdf_url?: string;
}

export interface SearchMessagesDto {
  query: string;
}

/**
 * Chat Message (para UI)
 * Versão adaptada para exibição com dados adicionais
 */
export interface ChatMessage {
  id?: string;
  role: MessageType;
  content: string;
  timestamp: string;
  pdfUrl?: string;
  citations?: Array<{ url: string }>;
  fileAttachment?: {
    name: string;
    size: number;
    type: string;
  };
}

/**
 * Converte Message (API) para ChatMessage (UI)
 */
export function messageToChatMessage(message: Message): ChatMessage {
  let content = message.content;
  let fileAttachment: ChatMessage["fileAttachment"];

  // Detecta anexo de arquivo
  const fileAttachmentRegex = /^Arquivo anexado: (.+?)(?:\n|$)/;
  const match = content.match(fileAttachmentRegex);

  if (match && message.messageType === MessageType.USER) {
    const fileName = match[1];
    fileAttachment = {
      name: fileName,
      size: 0, // Tamanho não disponível do backend
      type: fileName.endsWith(".pdf") ? "application/pdf" : "application/octet-stream",
    };

    // Remove a linha "Arquivo anexado: X" do conteúdo
    content = content.replace(fileAttachmentRegex, "").trim();
  }

  return {
    id: message.id,
    role: message.messageType,
    content,
    timestamp: message.created_at,
    pdfUrl: message.pdf_url || undefined,
    citations: message.citations || undefined,
    fileAttachment,
  };
}

/**
 * Converte ChatMessage (UI) para CreateMessageDto (API)
 */
export function chatMessageToCreateDto(
  message: Omit<ChatMessage, "id" | "timestamp">
): CreateMessageDto {
  return {
    content: message.content,
    messageType: message.role,
    pdf_url: message.pdfUrl,
  };
}
