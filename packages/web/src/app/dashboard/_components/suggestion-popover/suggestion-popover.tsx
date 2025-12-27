"use client";

import { ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

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
        <button className="group px-4 py-2 rounded-full border border-neutral-200 hover:border-neutral-300 bg-transparent hover:bg-black/[0.02] active:bg-black/[0.04] transition-all duration-200 ease-out text-[13px] text-neutral-600 hover:text-neutral-900 font-medium whitespace-nowrap">
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[calc(100vw-2rem)] sm:w-64 p-2 rounded-xl border-0 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)] backdrop-blur-xl bg-white/95"
        align="center"
        side="top"
        sideOffset={8}
      >
        <div className="space-y-0.5">
          <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide px-2 py-1.5 mb-1">
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
              className={`group/item w-full text-left px-3 py-2 rounded-lg transition-all duration-150 ${suggestion.prompt.trim()
                ? "hover:bg-black/[0.04] active:scale-[0.98] cursor-pointer"
                : "opacity-40 cursor-not-allowed"
                }`}
            >
              <p className="text-[13px] font-medium text-neutral-800 group-hover/item:text-neutral-950 transition-colors">
                {suggestion.title}
              </p>
              {!suggestion.prompt.trim() && (
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Cole a vaga acima
                </p>
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
