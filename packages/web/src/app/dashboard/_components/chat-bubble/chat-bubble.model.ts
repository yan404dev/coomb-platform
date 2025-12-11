import { useMemo } from "react";
import { formatMessageTime } from "@/shared/lib/format-message-time";
import type { ChatBubbleProps, Citation } from "./chat-bubble.types";

function formatCitationsInText(text: string, citations?: Citation[]): string {
  if (!citations || citations.length === 0) {
    return text;
  }

  return text.replace(/\[(\d+)\]/g, (match, number) => {
    const index = parseInt(number) - 1;
    const citation = citations[index];

    if (!citation) {
      return match;
    }

    return `[[${number}]](${citation.url})`;
  });
}

export function useChatBubbleModel(props: ChatBubbleProps) {
  const {
    content,
    timestamp,
    isUser,
    isStreaming,
    pdfUrl,
    citations,
    fileAttachment,
    hideTimestamp = false,
  } = props;

  const formattedTimestamp = useMemo(
    () => formatMessageTime(timestamp),
    [timestamp]
  );

  const contentWithCitations = useMemo(
    () => formatCitationsInText(content, citations),
    [content, citations]
  );

  const hasOnlyAttachment = useMemo(
    () => isUser && !!fileAttachment && !content,
    [isUser, fileAttachment, content]
  );

  const shouldShowCitations = useMemo(
    () => citations && citations.length > 0 && !isStreaming,
    [citations, isStreaming]
  );

  const shouldShowPdf = useMemo(
    () => !!pdfUrl && !isStreaming,
    [pdfUrl, isStreaming]
  );

  const shouldShowStreamingIndicator = useMemo(
    () => isStreaming && !content,
    [isStreaming, content]
  );

  return {
    formattedTimestamp,
    contentWithCitations,
    hasOnlyAttachment,
    shouldShowCitations,
    shouldShowPdf,
    shouldShowStreamingIndicator,
    hideTimestamp,
    isUser,
    isStreaming,
    content,
    pdfUrl,
    citations,
    fileAttachment,
  };
}
