import { useState } from "react";

interface UseProfileSectionCardModelProps {
  initialVisibleItems?: number;
  childrenCount: number;
}

export function useProfileSectionCardModel({
  initialVisibleItems = 2,
  childrenCount,
}: UseProfileSectionCardModelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasMore = childrenCount > initialVisibleItems;

  return {
    isExpanded,
    setIsExpanded,
    hasMore,
  };
}

