import { useState } from "react";

type TabType = "response" | "sources";

export function useOptimizationTabsModel() {
  const [activeTab, setActiveTab] = useState<TabType>("response");

  return {
    activeTab,
    setActiveTab,
  };
}

