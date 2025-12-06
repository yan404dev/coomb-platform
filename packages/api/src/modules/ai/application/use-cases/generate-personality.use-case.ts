import { Injectable, Inject } from "@nestjs/common";
import { CoombAIClientPort, GeneratePersonalityResult } from "../../domain/ports/coomb-ai-client.port";
import { UserRepositoryPort } from "../../../user/domain/ports/user.repository.port";
import { ResumeRepositoryPort } from "../../../resume/domain/ports/resume.repository.port";
import { INJECTION_TOKENS } from "../../../../common/constants/injection-tokens";

export interface GeneratePersonalityRequest {
  userId: string | null;
}

interface UserDataForPersonality {
  professional_summary?: string | null;
  career_goals?: string | null;
  experiences?: unknown[];
  skills?: unknown[];
}

@Injectable()
export class GeneratePersonalityUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.COOMB_AI_CLIENT_PORT)
    private readonly aiClient: CoombAIClientPort,
    @Inject(INJECTION_TOKENS.USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @Inject(INJECTION_TOKENS.RESUME_REPOSITORY_PORT)
    private readonly resumeRepository: ResumeRepositoryPort
  ) {}

  async execute(request: GeneratePersonalityRequest): Promise<GeneratePersonalityResult> {
    let userData: UserDataForPersonality | undefined = undefined;

    if (request.userId) {
      const user = await this.userRepository.findById(request.userId);
      const resume = await this.resumeRepository.findByUserId(request.userId);

      if (user && resume) {
        userData = {
          professional_summary: user.professional_summary ?? null,
          career_goals: user.career_goals ?? null,
          experiences: Array.isArray(resume.experiences) ? resume.experiences : [],
          skills: Array.isArray(resume.skills) ? resume.skills : [],
        };
      }
    }

    return this.aiClient.generatePersonality(request.userId, userData);
  }
}

