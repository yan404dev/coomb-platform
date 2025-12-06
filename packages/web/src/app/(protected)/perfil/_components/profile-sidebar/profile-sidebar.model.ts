import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { useResume } from "@/app/(protected)/curriculo/_hooks/use-resume";
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
  loading?: boolean;
}

export function useProfileSidebarModel({
  resume,
  loading,
}: UseProfileSidebarModelProps) {
  const [generating, setGenerating] = useState(false);
  const hasGeneratedRef = useRef(false);
  const { mutate } = useResume();
  const personality = resume?.user?.personality_profile;

  const generatePersonality = useCallback(async () => {
    try {
      setGenerating(true);
      toast.info("Gerando seu perfil de personalidade com IA...");
      await aiService.generatePersonality();
      toast.success("Perfil de personalidade gerado!");
      await mutate();
    } catch (error) {
      toast.error("Erro ao gerar perfil.");
    } finally {
      setGenerating(false);
    }
  }, [mutate]);

  useEffect(() => {
    if (!loading && resume && !personality && !hasGeneratedRef.current) {
      hasGeneratedRef.current = true;
      generatePersonality();
    }
  }, [loading, resume, personality, generatePersonality]);

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
