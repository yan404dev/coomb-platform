import type * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex items-center gap-x-3 px-4 py-3 rounded-lg border border-gray-500/[.32] w-full bg-transparent text-base outline-none transition-all min-h-[120px]",
        "focus-within:border-2 focus-within:border-primary",
        "placeholder:text-muted-foreground",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "resize-y",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
