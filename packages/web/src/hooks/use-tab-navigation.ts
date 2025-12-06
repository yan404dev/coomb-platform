"use client";

import { parseAsStringEnum, useQueryState } from "nuqs";
import { CurriculumSection } from "@/components/navigation-curriculum";

export function useTabNavigation() {
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringEnum<CurriculumSection>(Object.values(CurriculumSection))
      .withDefault(CurriculumSection.ABOUT)
  );

  return {
    currentTab: tab,
    setCurrentTab: setTab,
  };
}
