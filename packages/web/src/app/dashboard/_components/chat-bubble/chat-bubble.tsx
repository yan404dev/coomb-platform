import { cn } from "@/shared/lib/utils";
import { formatMessageTime } from "@/shared/lib/format-message-time";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { FileAttachmentCard } from "../file-attachment-card";
import { memo } from "react";

interface ChatBubbleProps {
  content: string;
  timestamp: string | Date;
  isUser: boolean;
  isStreaming?: boolean;
  pdfUrl?: string;
  citations?: Array<{ url: string }>;
  fileAttachment?: {
    name: string;
    size: number;
    type: string;
  };
  hideTimestamp?: boolean;
}

function formatCitationsInText(text: string, citations?: Array<{ url: string }>): string {
  if (!citations || citations.length === 0) {
    return text;
  }

  // Substitui [1], [2], etc por links markdown
  return text.replace(/\[(\d+)\]/g, (match, number) => {
    const index = parseInt(number) - 1;
    const citation = citations[index];

    if (!citation) {
      return match;
    }

    return `[[${number}]](${citation.url})`;
  });
}

const AssistantAvatar = () => (
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-800 text-xs font-semibold text-white shadow-sm">
    AI
  </div>
);

const UserAvatar = () => (
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#10b981] to-[#028A5A] text-xs font-semibold text-white shadow-sm">
    Você
  </div>
);

const markdownComponents: Components = {
  h2: ({ children }) => (
    <h2 className="mb-4 mt-6 text-xl font-semibold text-gray-900 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-3 mt-4 text-lg font-medium text-gray-900">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-3 text-[15px] leading-[21px] text-gray-800">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900">{children}</strong>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-emerald-600 underline decoration-emerald-600/40 underline-offset-2 transition-colors hover:text-emerald-700"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="mb-3 list-disc pl-6 text-gray-800">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal pl-6 text-gray-800">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="mb-1 text-[15px] leading-[21px] text-gray-800">
      {children}
    </li>
  ),
  code: ({ inline, className, children }: any) => {
    const isInline = inline ?? !className;
    return isInline ? (
      <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm text-gray-900">
        {children}
      </code>
    ) : (
      <code className="whitespace-pre-wrap text-sm text-gray-900">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-3 whitespace-pre-wrap rounded-lg bg-slate-200 p-4 text-gray-900">
      {children}
    </pre>
  ),
};

const ChatBubbleComponent = ({
  content,
  timestamp,
  isUser,
  isStreaming,
  pdfUrl,
  citations,
  fileAttachment,
  hideTimestamp = false,
}: ChatBubbleProps) => {
  const formattedTimestamp = formatMessageTime(timestamp);
  const contentWithCitations = formatCitationsInText(content, citations);

  const hasOnlyAttachment = isUser && fileAttachment && !content;

  return (
    <div
      className={cn(
        "flex gap-2",
        isUser ? "justify-end" : "justify-start items-end"
      )}
    >
      {!isUser && !hasOnlyAttachment && (
        <div className="self-end">
          <AssistantAvatar />
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
            {isStreaming && !content ? (
              <div className="py-1">
                <span className="text-sm font-medium inline-block bg-gradient-to-r from-gray-900 via-emerald-600 to-gray-900 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  Pensando...
                </span>
              </div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {contentWithCitations}
              </ReactMarkdown>
            )}

            {citations && citations.length > 0 && !isStreaming && (
              <div className="mt-4 pt-3 border-t border-slate-200">
                <p className="text-xs font-semibold text-gray-700 mb-2">Fontes:</p>
                <ol className="space-y-1">
                  {citations.map((citation, index) => {
                    let domain: string;
                    try {
                      domain = new URL(citation.url).hostname.replace('www.', '');
                    } catch {
                      domain = citation.url;
                    }

                    return (
                      <li key={index} className="text-xs text-gray-600">
                        <span className="font-medium text-gray-900">[{index + 1}]</span>{' '}
                        <a
                          href={citation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-600/40 underline-offset-2"
                        >
                          {domain}
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

            {pdfUrl && !isStreaming && (
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

        {isUser && !hasOnlyAttachment && (
          <span className="absolute bottom-0 -right-[2px] h-[13px] w-[8px]">
            <svg
              width="12"
              height="15"
              viewBox="0 0 12 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.1614 14.1304C7.44173 10.1227 6.28753 6.66791 6.05038 2.11758C6.02292 1.59068 5.28874 1.42252 5.05279 1.89443L0.183314 11.6334C0.0767245 11.8466 0.134722 12.1064 0.32866 12.245C3.46666 14.4867 7.80603 14.9142 10.7934 14.9865C11.2387 14.9973 11.4644 14.4569 11.1614 14.1304Z"
                fill="url(#userGradient)"
              />
              <defs>
                <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        )}

        {!isUser && !hasOnlyAttachment && (
          <span
            className="absolute bottom-0 -left-[2px] h-[13px] w-[8px]"
            style={{ transform: "scaleX(-1)" }}
          >
            <svg
              width="12"
              height="15"
              viewBox="0 0 12 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.1614 14.1304C7.44173 10.1227 6.28753 6.66791 6.05038 2.11758C6.02292 1.59068 5.28874 1.42252 5.05279 1.89443L0.183314 11.6334C0.0767245 11.8466 0.134722 12.1064 0.32866 12.245C3.46666 14.4867 7.80603 14.9142 10.7934 14.9865C11.2387 14.9973 11.4644 14.4569 11.1614 14.1304Z"
                fill="#e2e8f0"
              />
            </svg>
          </span>
        )}
      </div>

      {isUser && !hasOnlyAttachment && (
        <div className="self-end">
          <UserAvatar />
        </div>
      )}
    </div>
  );
};

export const ChatBubble = memo(ChatBubbleComponent, (prevProps, nextProps) => {
  return (
    prevProps.content === nextProps.content &&
    prevProps.isStreaming === nextProps.isStreaming &&
    prevProps.isUser === nextProps.isUser &&
    prevProps.pdfUrl === nextProps.pdfUrl &&
    prevProps.timestamp === nextProps.timestamp &&
    JSON.stringify(prevProps.citations) === JSON.stringify(nextProps.citations)
  );
});
