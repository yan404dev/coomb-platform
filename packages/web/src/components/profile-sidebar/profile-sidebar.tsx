"use client";

import { Briefcase, SquareUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Resume } from "@/entities";
import { useProfileSidebarModel } from "./profile-sidebar.model";

interface ProfileSidebarProps {
  resume?: Resume | null;
  loading?: boolean;
}

export const ProfileSidebar = ({ resume, loading }: ProfileSidebarProps) => {
  const { generating, personality, profileData, PERSONALITY_CONFIG } =
    useProfileSidebarModel({ resume, loading });

  return (
    <aside className="flex flex-col gap-4">
      <Card className="w-full px-4">
        <CardTitle className="break-inside-avoid font-semibold text-lg text-foreground flex items-center gap-2">
          <SquareUser />
          Seu perfil
        </CardTitle>

        {loading || generating || !personality ? (
          <CardContent className="px-0 flex flex-col gap-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        ) : (
          <CardContent className="px-0 flex flex-col gap-2">
            <CardTitle className="break-inside-avoid font-normal text-base text-gray-600">
              Você é um {profileData?.primary.label.toLowerCase()}{" "}
              {profileData?.secondary.label.toLowerCase()}
            </CardTitle>

            <div className="w-full">
              <div className="w-full h-7 rounded-full flex overflow-hidden">
                {profileData?.scores.map((item) => (
                  <div
                    key={item.key}
                    className={`${item.color} flex items-center justify-center transition-all`}
                    style={{ width: `${item.score}%` }}
                  >
                    {item.key === profileData.primary.key && (
                      <div className="bg-white w-2 h-2 rounded-full" />
                    )}
                  </div>
                ))}
              </div>

              <div className="w-full flex mt-2">
                {PERSONALITY_CONFIG.map((config) => (
                  <div key={config.key} className="w-[25%] text-center">
                    <span className="text-[10px] text-gray-600 font-medium">
                      {config.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4">
              <CardTitle className="break-inside-avoid font-semibold text-base text-foreground">
                Me conte sobre você
              </CardTitle>
              <CardDescription className="break-inside-avoid text-sm font-normal text-[rgba(75,85,99,0.80)] leading-relaxed">
                {personality.description}
              </CardDescription>
            </div>

            {personality.interview_tip && (
              <div className="flex flex-col gap-2 pt-4 border-t mt-4">
                <CardTitle className="break-inside-avoid font-semibold text-base text-foreground">
                  Dica para entrevista
                </CardTitle>
                <CardDescription className="break-inside-avoid text-sm font-normal text-[rgba(75,85,99,0.80)] leading-relaxed bg-green-50 p-3 rounded-lg border border-green-200">
                  {personality.interview_tip}
                </CardDescription>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      <Card className="w-full px-4">
        <CardTitle className="break-inside-avoid font-semibold text-lg text-foreground flex items-center gap-2">
          <Briefcase />
          Seu currículo
        </CardTitle>

        <CardContent className="px-0 flex flex-col gap-2">
          <CardDescription className="break-inside-avoid text-sm font-normal text-[rgba(75,85,99,0.80)] leading-relaxed">
            Edite seu currículo ou baixe-o para enviar aos recrutadores. Clique
            em 'Otimizar para vaga' para atualizações ou 'Baixar Currículo' para
            fazer o download no nosso formato.
          </CardDescription>

          <CardFooter className="px-0 flex items-center justify-between gap-2">
            <Button
              variant="outline"
              className="w-1/2 border-[#03A16C] text-[#03A16C] bg-white hover:bg-green-50 rounded-lg"
            >
              Baixar currículo
            </Button>
            <Button className="w-1/2 bg-[#03A16C] hover:bg-[#028A5A] text-white rounded-lg">
              Otimizar para vaga
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </aside>
  );
};
