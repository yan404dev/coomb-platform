"use client";

import { ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SuggestionItem {
  title: string;
  description: string;
  prompt: string;
}

interface SuggestionPopoverProps {
  icon: ReactNode;
  label: string;
  title: string;
  suggestions: SuggestionItem[];
  onSelect: (prompt: string) => void;
}

export const SuggestionPopover = ({
  icon,
  label,
  title,
  suggestions,
  onSelect,
}: SuggestionPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all text-xs sm:text-sm text-gray-700 hover:text-gray-900 font-medium whitespace-nowrap">
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-2rem)] sm:w-72 p-3 rounded-2xl" align="center" side="top">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 px-2 py-1 mb-2">
            {title}
          </p>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                if (suggestion.prompt.trim()) {
                  onSelect(suggestion.prompt);
                }
              }}
              disabled={!suggestion.prompt.trim()}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors ${
                suggestion.prompt.trim()
                  ? "hover:bg-gray-100 active:bg-gray-200 cursor-pointer"
                  : "opacity-60 cursor-default"
              }`}
            >
              <p className="text-sm font-medium text-gray-900">
                {suggestion.title}
              </p>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                {suggestion.description}
              </p>
              {!suggestion.prompt.trim() && (
                <p className="text-xs text-blue-600 mt-1 font-medium">
                  💡 Cole a descrição da vaga acima para começar
                </p>
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
