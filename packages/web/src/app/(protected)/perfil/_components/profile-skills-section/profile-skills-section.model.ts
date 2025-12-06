import { useState } from "react";

export function useProfileSkillsSectionModel() {
  const [isSkillsExpanded, setIsSkillsExpanded] = useState(false);
  const [isLanguagesExpanded, setIsLanguagesExpanded] = useState(false);

  return {
    isSkillsExpanded,
    setIsSkillsExpanded,
    isLanguagesExpanded,
    setIsLanguagesExpanded,
  };
}

