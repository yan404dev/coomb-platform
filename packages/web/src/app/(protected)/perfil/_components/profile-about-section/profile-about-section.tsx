import { Pencil, FileText } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { CurriculumSection } from "../../../curriculo/_components/navigation-curriculum";
import type { Resume } from "@/shared/entities";

interface ProfileAboutSectionProps {
  resume?: Resume | null;
}

export const ProfileAboutSection = ({ resume }: ProfileAboutSectionProps) => {
  const professionalSummary = resume?.user?.professionalSummary || "";
  const careerGoals = resume?.user?.careerGoals || "";

  if (!professionalSummary && !careerGoals) {
    return (
      <Card className="w-full p-3 md:p-4 xl:p-6 flex flex-col gap-4 md:gap-6">
        <div className="flex items-center justify-between">
          <CardTitle className="break-inside-avoid font-semibold text-lg md:text-xl lg:text-2xl text-foreground">
            Sobre você
          </CardTitle>
        </div>

        <CardContent className="px-0 flex flex-col items-center justify-center py-8 gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <CardDescription className="text-center text-sm md:text-base text-gray-600">
            Adicione informações sobre você para melhorar seu perfil
          </CardDescription>
          <Link href={`/curriculo?tab=${CurriculumSection.ABOUT}`}>
            <Button className="bg-[#03A16C] hover:bg-[#028A5A] text-white">
              Preencher informações
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
          Sobre você
        </CardTitle>

        <Link href={`/curriculo?tab=${CurriculumSection.ABOUT}`}>
          <button className="flex items-center text-xs md:text-sm gap-1 text-[#03A16C] font-semibold cursor-pointer">
            <Pencil size={12} className="md:w-[15px] md:h-[15px]" />
            <span className="hidden sm:inline">Editar</span>
          </button>
        </Link>
      </div>

      <CardContent className="px-0">
        {professionalSummary && (
          <CardDescription className="break-inside-avoid text-sm md:text-base font-normal text-[rgba(75,85,99,0.80)] leading-relaxed">
            {professionalSummary}
          </CardDescription>
        )}

        {careerGoals && (
          <>
            <CardTitle className="break-inside-avoid font-semibold text-base md:text-lg lg:text-xl text-foreground mt-4 md:mt-6">
              Cargo(s) de interesse
            </CardTitle>
            <CardDescription className="break-inside-avoid text-sm md:text-base font-normal text-[rgba(75,85,99,0.80)] leading-relaxed">
              {careerGoals}
            </CardDescription>
          </>
        )}
      </CardContent>
    </Card>
  );
};
