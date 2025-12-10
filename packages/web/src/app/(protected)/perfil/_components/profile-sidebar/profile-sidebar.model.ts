import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { aiService } from "@/app/dashboard/_services/ai.service";
import type { Resume } from "@/shared/types";

const PERSONALITY_CONFIG = [
  { key: "executor", label: "Executor", color: "bg-red-500" },
  { key: "comunicador", label: "Comunicador", color: "bg-yellow-500" },
  { key: "planejador", label: "Planejador", color: "bg-green-500" },
  { key: "analista", label: "Analista", color: "bg-blue-500" },
] as const;

interface UseProfileSidebarModelProps {
  resume?: Resume | null;
}

export function useProfileSidebarModel({
  resume,
}: UseProfileSidebarModelProps) {
  const [generating, setGenerating] = useState(false);
  const hasGeneratedRef = useRef(false);
  const router = useRouter();
  const personality = resume?.user?.personality_profile;

  const generatePersonality = useCallback(async () => {
    try {
      setGenerating(true);
      toast.info("Gerando seu perfil de personalidade com IA...");
      await aiService.generatePersonality();
      toast.success("Perfil de personalidade gerado!");
      router.refresh();
    } catch {
      toast.error("Erro ao gerar perfil.");
    } finally {
      setGenerating(false);
    }
  }, [router]);

  useEffect(() => {
    if (resume && !personality && !hasGeneratedRef.current) {
      hasGeneratedRef.current = true;
      generatePersonality();
    }
  }, [resume, personality, generatePersonality]);

  const getDominantProfile = () => {
    if (!personality) return null;

    const scores = PERSONALITY_CONFIG.map((config) => ({
      ...config,
      score: personality[config.key] || 0,
    }));

    const dominant = scores.reduce((max, item) =>
      item.score > max.score ? item : max
    );

    const secondHighest = scores
      .filter((s) => s.key !== dominant.key)
      .reduce((max, item) => (item.score > max.score ? item : max));

    return {
      primary: dominant,
      secondary: secondHighest,
      scores,
    };
  };

  return {
    generating,
    personality,
    profileData: getDominantProfile(),
    PERSONALITY_CONFIG,
  };
}
