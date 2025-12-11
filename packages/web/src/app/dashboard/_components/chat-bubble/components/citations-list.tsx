import type { Citation } from "../chat-bubble.types";

interface CitationsListProps {
  citations: Citation[];
}

export function CitationsList({ citations }: CitationsListProps) {
  if (citations.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 pt-3 border-t border-slate-200">
      <p className="text-xs font-semibold text-gray-700 mb-2">Fontes:</p>
      <ol className="space-y-1">
        {citations.map((citation, index) => {
          let domain: string;
          try {
            domain = new URL(citation.url).hostname.replace("www.", "");
          } catch {
            domain = citation.url;
          }

          return (
            <li key={index} className="text-xs text-gray-600">
              <span className="font-medium text-gray-900">[{index + 1}]</span>{" "}
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
  );
}
