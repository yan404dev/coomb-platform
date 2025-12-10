"use client";

import { useMemo } from "react";
import { AboutForm } from "../about-form";
import { OutrasInfoTab } from "../additional-info-form";
import { ExperiencesForm } from "../experiences-form";
import {
  CurriculumSection,
  NavigationCurriculum,
  type NavigationItem,
} from "../navigation-curriculum";
import { SidebarCurriculum } from "../sidebar-curriculum";
import { SkillsList } from "../skills-list";
import { LanguagesList } from "../languages-list";
import { getResumeCompletionStats } from "@/shared/utils/resume-completion";
import { ImportCurriculumCard } from "./import-curriculum-card";
import { useTabNavigation } from "@/app/(protected)/curriculo/_hooks/use-tab-navigation";
import type { Resume } from "@/shared/types";

interface CurriculumContainerProps {
  navigationItems: NavigationItem[];
  photoUploadData: {
    title: string;
    subtitle: string;
    formats: string[];
    maxSize: string;
    instructions: string;
  };
  resume: Resume | null;
}

export function CurriculumContainer({
  navigationItems,
  photoUploadData,
  resume,
}: CurriculumContainerProps) {
  const { currentTab, setCurrentTab } = useTabNavigation();
  const completion = useMemo(() => getResumeCompletionStats(resume), [resume]);
  const { percentage } = completion;

  const progressData = useMemo(
    () => ({
      title: "Bem vindo!",
      subtitle:
        "Olá, vamos começar a preencher o seu currículo. Nesta primeira etapa queremos saber um pouco mais sobre você. 👋",
      percentage,
    }),
    [percentage]
  );

  return (
    <div className="space-y-6 pb-14">
      <NavigationCurriculum
        items={navigationItems}
        currentSection={currentTab}
        onSectionChange={setCurrentTab}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 lg:gap-8">
        <div className="hidden lg:block">
          <SidebarCurriculum
            progressData={progressData}
            photoUploadData={photoUploadData}
          />
        </div>

        <main className="min-w-0 space-y-6 w-full">
          {currentTab === CurriculumSection.ABOUT && (
            <>
              <ImportCurriculumCard />
              <AboutForm
                onContinue={() => setCurrentTab(CurriculumSection.EXPERIENCES)}
              />
            </>
          )}

          {currentTab === CurriculumSection.EXPERIENCES && <ExperiencesForm resume={resume} />}

          {currentTab === CurriculumSection.SKILLS && (
            <div className="space-y-6">
              <SkillsList resume={resume} />
              <LanguagesList resume={resume} />
            </div>
          )}

          {currentTab === CurriculumSection.OTHER && <OutrasInfoTab resume={resume} />}
        </main>
      </div>
    </div>
  );
}
