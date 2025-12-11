"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useOptimizationTabsModel } from "./optimization-tabs.model";

interface OptimizationTabsProps {
  content: string;
  citations: never[];
  isPending: boolean;
}

export function OptimizationTabs({
  content,
  citations,
  isPending,
}: OptimizationTabsProps) {
  const { activeTab, setActiveTab } = useOptimizationTabsModel();

  return (
    <div className="w-full">
      {/* Tabs Header */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => setActiveTab("response")}
          className={`
            px-6 py-3 font-medium text-sm transition-colors relative
            ${
              activeTab === "response"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }
          `}
        >
          Resposta
          {activeTab === "response" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sources")}
          className={`
            px-6 py-3 font-medium text-sm transition-colors relative
            ${
              activeTab === "sources"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }
          `}
        >
          Fontes
          {activeTab === "sources" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === "response" && (
          <div className="prose dark:prose-invert max-w-none">
            {content ? (
              <>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
                {isPending && (
                  <span className="inline-block w-2 h-5 ml-1 bg-blue-600 dark:bg-blue-400 animate-pulse" />
                )}
              </>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 italic">
                Aguardando resposta...
              </div>
            )}
          </div>
        )}

        {activeTab === "sources" && (
          <div className="space-y-4">
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Nenhuma fonte disponível
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
