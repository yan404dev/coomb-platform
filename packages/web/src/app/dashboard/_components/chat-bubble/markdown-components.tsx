import type { Components } from "react-markdown";

export const markdownComponents: Components = {
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
