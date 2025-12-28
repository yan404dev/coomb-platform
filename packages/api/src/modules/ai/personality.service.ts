import { Injectable, Inject, Optional } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CoombAIClientPort } from "./ai.types";
import { INJECTION_TOKENS } from "../../common/constants/injection-tokens";
import { GeneratePersonalityResponseDto } from "./dtos/ai.dto";

@Injectable()
export class AIPersonalityService {
  constructor(
    private readonly prisma: PrismaService,
    @Optional()
    @Inject(INJECTION_TOKENS.COOMB_AI_CLIENT_PORT)
    private readonly coombAI?: CoombAIClientPort
  ) { }

  async generatePersonality(userId: string | null): Promise<GeneratePersonalityResponseDto> {
    if (!this.coombAI) {
      throw new Error("Serviço de IA não disponível");
    }

    let userData = undefined;
    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          resume: {
            include: {
              experiences: true,
              skills: true,
            },
          },
        },
      });

      if (user?.resume) {
        userData = {
          professional_summary: user.professional_summary,
          career_goals: user.career_goals,
          experiences: user.resume.experiences,
          skills: user.resume.skills,
        };
      }
    }

    const result = await this.coombAI.generatePersonality(userId, userData);

    if (userId && result.personality) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { personality_profile: result.personality as any },
      });
    }

    return result;
  }
}
