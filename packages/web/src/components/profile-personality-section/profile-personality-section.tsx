import { Pencil } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CurriculumSection } from "@/components/navigation-curriculum";
import type { Resume } from "@/entities";

interface ProfilePersonalitySectionProps {
  resume?: Resume | null;
  loading?: boolean;
}

const PERSONALITY_TYPES = [
  { key: "executor", label: "Executor", color: "bg-blue-500" },
  { key: "comunicador", label: "Comunicador", color: "bg-green-500" },
  { key: "planejador", label: "Planejador", color: "bg-purple-500" },
  { key: "analista", label: "Analista", color: "bg-orange-500" },
] as const;

export const ProfilePersonalitySection = ({
  resume,
  loading,
}: ProfilePersonalitySectionProps) => {
  const personality = resume?.user?.personality_profile;

  if (loading) {
    return (
      <Card className="w-full p-3 md:p-4 xl:p-6 flex flex-col gap-4 md:gap-6">
        <Skeleton className="h-7 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Card>
    );
  }

  if (!personality) {
    return null;
  }

  const scores = [
    { type: "executor", score: personality.executor },
    { type: "comunicador", score: personality.comunicador },
    { type: "planejador", score: personality.planejador },
    { type: "analista", score: personality.analista },
  ];
  const dominant = scores.reduce((max, item) =>
    item.score > max.score ? item : max
  );

  return (
    <Card className="w-full p-3 md:p-4 xl:p-6 flex flex-col gap-4 md:gap-6 data-[disableShadow=true]:shadow-none">
      <div className="flex items-center justify-between">
        <CardTitle className="break-inside-avoid font-semibold text-lg md:text-xl lg:text-2xl text-foreground">
          Seu perfil
        </CardTitle>

        <Link href={`/curriculo?tab=${CurriculumSection.ABOUT}`}>
          <button className="flex items-center text-xs md:text-sm gap-1 text-[#03A16C] font-semibold cursor-pointer">
            <Pencil size={12} className="md:w-[15px] md:h-[15px]" />
            <span className="hidden sm:inline">Editar</span>
          </button>
        </Link>
      </div>

      <CardContent className="px-0 space-y-6">
        <div className="space-y-3">
          {PERSONALITY_TYPES.map((type) => {
            const score = personality[type.key];
            return (
              <div key={type.key} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-foreground">
                    {type.label}
                  </span>
                  <span className="text-muted-foreground">{score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${type.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-semibold text-foreground mb-1">
            Você é um{" "}
            {PERSONALITY_TYPES.find((t) => t.key === dominant.type)?.label}
          </p>
          <p className="text-xs text-muted-foreground">
            {dominant.score}% de afinidade com este perfil
          </p>
        </div>

        {personality.description && (
          <>
            <CardTitle className="break-inside-avoid font-semibold text-base md:text-lg lg:text-xl text-foreground">
              Me conte sobre você
            </CardTitle>
            <CardDescription className="break-inside-avoid text-sm md:text-base font-normal text-[rgba(75,85,99,0.80)] leading-relaxed">
              {personality.description}
            </CardDescription>
          </>
        )}
      </CardContent>
    </Card>
  );
};
