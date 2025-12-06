import { Injectable } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";

export interface PersonalityProfile {
  executor: number;
  comunicador: number;
  planejador: number;
  analista: number;
  description?: string;
}

export interface PersonalityConfig {
  key: keyof PersonalityProfile;
  label: string;
  color: string;
  score: number;
}

export interface DominantProfile {
  primary: PersonalityConfig;
  secondary: PersonalityConfig;
  scores: PersonalityConfig[];
}

@Injectable()
export class PersonalityService {
  private readonly PERSONALITY_CONFIG = [
    { key: "executor", label: "Executor", color: "bg-red-500" },
    { key: "comunicador", label: "Comunicador", color: "bg-yellow-500" },
    { key: "planejador", label: "Planejador", color: "bg-green-500" },
    { key: "analista", label: "Analista", color: "bg-blue-500" },
  ] as const;

  constructor(private readonly userRepository: UserRepository) {}

  async getDominantProfile(userId: string): Promise<DominantProfile | null> {
    const user = await this.userRepository.findUnique({ id: userId });

    if (!user || !user.personality_profile) {
      return null;
    }

    const personality = user.personality_profile as unknown as PersonalityProfile;

    const scores = this.PERSONALITY_CONFIG.map((config) => ({
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
  }

  getPersonalityConfig() {
    return this.PERSONALITY_CONFIG;
  }
}

