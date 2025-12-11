import { memo } from "react";
import { cn } from "@/shared/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileAttachmentCard } from "../file-attachment-card";
import { useChatBubbleModel } from "./chat-bubble.model";
import { markdownComponents } from "./markdown-components";
import {
  Avatar,
  BubbleTail,
  CitationsList,
  StreamingIndicator,
} from "./components";
import type { ChatBubbleProps } from "./chat-bubble.types";

function ChatBubbleComponent(props: ChatBubbleProps) {
  const {
    formattedTimestamp,
    contentWithCitations,
    hasOnlyAttachment,
    shouldShowCitations,
    shouldShowPdf,
    shouldShowStreamingIndicator,
    hideTimestamp,
    isUser,
    content,
    citations,
    fileAttachment,
    pdfUrl,
  } = useChatBubbleModel(props);

  return (
    <div
      className={cn(
        "flex gap-2",
        isUser ? "justify-end" : "justify-start items-end"
      )}
    >
      {!isUser && !hasOnlyAttachment && (
        <div className="self-end">
          <Avatar isUser={false} />
        </div>
      )}

      <div
        className={cn(
          "relative rounded-[12px] shadow-sm transition-all",
          hasOnlyAttachment
            ? "px-0 py-0"
            : "px-4 pb-5 pt-2 pr-12",
          !hasOnlyAttachment && isUser
            ? "max-w-[75%] rounded-br-none bg-gradient-to-br from-[#10b981] to-[#059669] text-white"
            : !hasOnlyAttachment
            ? "max-w-[75%] rounded-bl-none bg-gradient-to-br from-slate-100 to-slate-50 text-gray-900 border border-slate-200"
            : ""
        )}
      >
        {isUser ? (
          <div className={cn(hasOnlyAttachment ? "" : "space-y-3")}>
            {fileAttachment && (
              <FileAttachmentCard
                name={fileAttachment.name}
                size={fileAttachment.size}
                type={fileAttachment.type}
              />
            )}
            {content && (
              <p className="whitespace-pre-wrap break-words text-[15px] leading-[21px]">
                {content}
              </p>
            )}
          </div>
        ) : (
          <div className="text-gray-900">
            {shouldShowStreamingIndicator ? (
              <StreamingIndicator />
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {contentWithCitations}
              </ReactMarkdown>
            )}

            {shouldShowCitations && citations && (
              <CitationsList citations={citations} />
            )}

            {shouldShowPdf && pdfUrl && (
              <div className="mt-4">
                <FileAttachmentCard
                  name="curriculo_otimizado.pdf"
                  type="application/pdf"
                  downloadUrl={pdfUrl}
                  requireAuth={true}
                />
              </div>
            )}
          </div>
        )}

        {!hideTimestamp && !hasOnlyAttachment && (
          <span
            className={cn(
              "absolute bottom-[2px] right-3 text-[11px] leading-[15px]",
              isUser ? "text-white/90" : "text-gray-600"
            )}
          >
            {formattedTimestamp}
          </span>
        )}

        {!hasOnlyAttachment && <BubbleTail isUser={isUser} />}
      </div>

      {isUser && !hasOnlyAttachment && (
        <div className="self-end">
          <Avatar isUser={true} />
        </div>
      )}
    </div>
  );
}

export const ChatBubble = memo(ChatBubbleComponent, (prevProps, nextProps) => {
  if (
    prevProps.content !== nextProps.content ||
    prevProps.isStreaming !== nextProps.isStreaming ||
    prevProps.isUser !== nextProps.isUser ||
    prevProps.pdfUrl !== nextProps.pdfUrl ||
    prevProps.timestamp !== nextProps.timestamp
  ) {
    return false;
  }

  if (prevProps.citations?.length !== nextProps.citations?.length) {
    return false;
  }

  if (prevProps.citations && nextProps.citations) {
    for (let i = 0; i < prevProps.citations.length; i++) {
      if (prevProps.citations[i].url !== nextProps.citations[i].url) {
        return false;
      }
    }
  }

  return true;
});

ChatBubble.displayName = "ChatBubble";
