import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Header } from "@/components";
import { CurriculumContainer } from "./_components/curriculum/curriculum-container";
import { CurriculumSection } from "./_components/navigation-curriculum";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getResume } from "../perfil/_data/get-resume";

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

export default async function Resume() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/entrar?redirectTo=/curriculo");
  }

  const resume = await getResume();

  return (
    <TooltipProvider>
      <Header nav />
      <div className="px-4 md:px-8 lg:px-24 mx-auto container pt-28 pb-14">
        <CurriculumContainer
          navigationItems={navigationItems}
          photoUploadData={photoUploadData}
          resume={resume}
        />
      </div>
    </TooltipProvider>
  );
}
