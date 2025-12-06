"use client";

import { Pencil, FileText } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CurriculumSection } from "../../../curriculo/_components/navigation-curriculum";
import type { Resume } from "@/shared/types";
import { useProfileSkillsSectionModel } from "./profile-skills-section.model";

interface ProfileSkillsSectionProps {
  resume?: Resume | null;
  loading?: boolean;
}

export const ProfileSkillsSection = ({ resume, loading }: ProfileSkillsSectionProps) => {
  const {
    isSkillsExpanded,
    setIsSkillsExpanded,
    isLanguagesExpanded,
    setIsLanguagesExpanded,
  } = useProfileSkillsSectionModel();

  const skills = resume?.skills || [];
  const languages = resume?.languages || [];

  const INITIAL_VISIBLE_SKILLS = 6;
  const INITIAL_VISIBLE_LANGUAGES = 4;

  const hasMoreSkills = skills.length > INITIAL_VISIBLE_SKILLS;
  const hasMoreLanguages = languages.length > INITIAL_VISIBLE_LANGUAGES;

  const visibleSkills = isSkillsExpanded ? skills : skills.slice(0, INITIAL_VISIBLE_SKILLS);
  const visibleLanguages = isLanguagesExpanded ? languages : languages.slice(0, INITIAL_VISIBLE_LANGUAGES);

  if (loading) {
    return (
      <Card className="w-full p-3 md:p-4 xl:p-6 flex flex-col gap-4 md:gap-6">
        <Skeleton className="h-7 w-40" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </div>
      </Card>
    );
  }

  if (skills.length === 0 && languages.length === 0) {
    return (
      <Card className="w-full p-3 md:p-4 xl:p-6 flex flex-col gap-4 md:gap-6">
        <div className="flex items-center justify-between">
          <CardTitle className="break-inside-avoid font-semibold text-lg md:text-xl lg:text-2xl text-foreground">
            Suas habilidades
          </CardTitle>
        </div>

        <CardContent className="px-0 flex flex-col items-center justify-center py-8 gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <CardDescription className="text-center text-sm md:text-base text-gray-600">
            Adicione suas habilidades e idiomas
          </CardDescription>
          <Link href={`/curriculo?tab=${CurriculumSection.SKILLS}`}>
            <Button className="bg-[#03A16C] hover:bg-[#028A5A] text-white">
              Adicionar habilidades
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full p-3 md:p-4 xl:p-6 flex flex-col gap-4 md:gap-6 data-[disableShadow=true]:shadow-none">
      <div className="flex items-center justify-between">
        <CardTitle className="break-inside-avoid font-semibold text-lg md:text-xl lg:text-2xl text-foreground">
          Suas habilidades
        </CardTitle>

        <Link href={`/curriculo?tab=${CurriculumSection.SKILLS}`}>
          <button className="flex items-center text-xs md:text-sm gap-1 text-[#03A16C] font-semibold cursor-pointer">
            <Pencil size={12} className="md:w-[15px] md:h-[15px]" />
            <span className="hidden sm:inline">Editar</span>
          </button>
        </Link>
      </div>

      <CardContent className="px-0">
        {skills.length > 0 && (
          <>
            <CardTitle className="break-inside-avoid font-semibold text-base md:text-lg lg:text-xl text-foreground mt-4 md:mt-6 mb-3 md:mb-4">
              Habilidades cadastradas
            </CardTitle>
            <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
              {visibleSkills.map((skill, index) => (
                <span
                  key={index}
                  className="py-1.5 md:py-2 px-2 md:px-3 border-2 rounded-full text-xs md:text-sm text-[rgba(75,85,99,0.80)] font-bold"
                >
                  {skill.name}
                </span>
              ))}
            </div>
            {hasMoreSkills && (
              <>
                <Separator className="mb-4" />
                <div className="flex justify-center">
                  <button
                    onClick={() => setIsSkillsExpanded(!isSkillsExpanded)}
                    className="flex items-center gap-2 text-black font-semibold text-xs md:text-sm hover:text-[#03A16C] transition-colors cursor-pointer"
                  >
                    <span className="text-base">{isSkillsExpanded ? '-' : '+'}</span>
                    <span>{isSkillsExpanded ? 'Ocultar habilidades' : 'Exibir todas as habilidades'}</span>
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {languages.length > 0 && (
          <>
            <CardTitle className="break-inside-avoid font-semibold text-base md:text-lg lg:text-xl text-foreground mb-3 md:mb-4 mt-6">
              Idiomas cadastrados
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              {visibleLanguages.map((language, index) => (
                <span
                  key={index}
                  className="py-1.5 md:py-2 px-2 md:px-3 border-2 rounded-full text-xs md:text-sm text-[rgba(75,85,99,0.80)] font-bold"
                >
                  {language.name}
                </span>
              ))}
            </div>
            {hasMoreLanguages && (
              <>
                <Separator className="mt-4 mb-4" />
                <div className="flex justify-center">
                  <button
                    onClick={() => setIsLanguagesExpanded(!isLanguagesExpanded)}
                    className="flex items-center gap-2 text-black font-semibold text-xs md:text-sm hover:text-[#03A16C] transition-colors cursor-pointer"
                  >
                    <span className="text-base">{isLanguagesExpanded ? '-' : '+'}</span>
                    <span>{isLanguagesExpanded ? 'Ocultar idiomas' : 'Exibir todos os idiomas'}</span>
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
