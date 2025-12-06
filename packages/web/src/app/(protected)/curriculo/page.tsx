import { Suspense } from "react";
import { Header } from "@/components";
import { CurriculumContainer } from "@/components/curriculum/curriculum-container";
import { CurriculumSection } from "@/components/navigation-curriculum";
import { TooltipProvider } from "@/components/ui/tooltip";

const navigationItems = [
  { label: "Sobre", section: CurriculumSection.ABOUT },
  {
    label: "Experiências",
    section: CurriculumSection.EXPERIENCES,
  },
  { label: "Habilidades", section: CurriculumSection.SKILLS },
  { label: "Outras", section: CurriculumSection.OTHER },
];

const photoUploadData = {
  title: "Inclua sua foto",
  subtitle: "opcional",
  formats: ["No formato .PNG ou .JPEG"],
  maxSize: "2 MB",
  instructions: "Envie uma foto iluminada e centralizada do seu rosto.",
};

export default function Resume() {
  return (
    <TooltipProvider>
      <Header nav />
      <div className="px-4 md:px-8 lg:px-24 mx-auto container pt-28 pb-14">
        <Suspense
          fallback={
            <div className="flex h-32 items-center justify-center text-muted-foreground">
              Carregando currículo...
            </div>
          }
        >
          <CurriculumContainer
            navigationItems={navigationItems}
            photoUploadData={photoUploadData}
          />
        </Suspense>
      </div>
    </TooltipProvider>
  );
}
