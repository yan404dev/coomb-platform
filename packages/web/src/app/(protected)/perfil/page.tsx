import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Header } from "@/components";
import { ProfileAboutSection } from "./_components/profile-about-section";
import { ProfileHeader } from "./_components/profile-header";
import { ProfileSectionCard } from "./_components/profile-section-card";
import { ProfileSectionItem } from "./_components/profile-section-card";
import { ProfileSidebar } from "./_components/profile-sidebar";
import { ProfileSkillsSection } from "./_components/profile-skills-section";
import { CurriculumSection } from "../curriculo/_components/navigation-curriculum";
import { getResume } from "./_data/get-resume";

export default async function Profile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/entrar?redirectTo=/perfil");
  }

  const resume = await getResume();

  return (
    <>
      <Header nav />

      <div className="h-64 md:h-72 bg-[url('/capa.png')] bg-cover bg-right" />

      <div className="w-full -mt-12 md:-mt-20">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 lg:gap-8">
              <main className="space-y-6 min-w-0">
                <ProfileHeader resume={resume} />
                <ProfileAboutSection resume={resume} />

                <ProfileSectionCard
                  title="Suas experiências"
                  showAllText="Exibir todas as experiências"
                  editSection={CurriculumSection.EXPERIENCES}
                  isEmpty={
                    !resume?.experiences || resume.experiences.length === 0
                  }
                  emptyMessage="Adicione suas experiências profissionais"
                  emptyButtonText="Adicionar experiência"
                >
                  {resume?.experiences?.map((exp, index) => (
                    <ProfileSectionItem
                      key={index}
                      title={exp.position}
                      subtitle={exp.company}
                      periodValue={
                        exp.current
                          ? `${exp.startDate} até a data atual`
                          : `${exp.startDate} até ${exp.endDate}`
                      }
                      description={exp.description || undefined}
                    />
                  ))}
                </ProfileSectionCard>

                <ProfileSkillsSection resume={resume} />

                <ProfileSectionCard
                  title="Suas formações"
                  showAllText="Exibir todas as formações"
                  editSection={CurriculumSection.OTHER}
                  isEmpty={
                    !resume?.educations || resume.educations.length === 0
                  }
                  emptyMessage="Adicione suas formações acadêmicas"
                  emptyButtonText="Adicionar formação"
                >
                  {resume?.educations?.map((edu, index) => (
                    <ProfileSectionItem
                      key={index}
                      title={edu.degree}
                      subtitle={edu.institution}
                      periodValue={
                        edu.current
                          ? `${edu.startDate} até a data atual`
                          : `${edu.startDate} até ${edu.endDate}`
                      }
                    />
                  ))}
                </ProfileSectionCard>

                <ProfileSectionCard
                  title="Seus cursos profissionalizantes e certificações"
                  showAllText="Exibir todos os cursos e certificações"
                  editSection={CurriculumSection.OTHER}
                  isEmpty={
                    !resume?.certifications ||
                    resume.certifications.length === 0
                  }
                  emptyMessage="Adicione cursos e certificações"
                  emptyButtonText="Adicionar certificação"
                >
                  {resume?.certifications?.map((cert, index) => (
                    <ProfileSectionItem
                      key={index}
                      title={cert.name}
                      subtitle={cert.institution}
                      periodLabel="Data de conclusão"
                      periodValue={cert.completionDate}
                    />
                  ))}
                </ProfileSectionCard>
              </main>

              <aside className="hidden lg:block">
                <ProfileSidebar resume={resume} />
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
