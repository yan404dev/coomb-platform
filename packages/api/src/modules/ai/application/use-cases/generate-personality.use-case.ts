import { Injectable, Inject } from "@nestjs/common";
import { CoombAIClientPort, GeneratePersonalityResult } from "../../domain/ports/coomb-ai-client.port";
import { UserRepositoryPort } from "../../../user/domain/ports/user.repository.port";
import { ResumeRepositoryPort } from "../../../resume/domain/ports/resume.repository.port";

export interface GeneratePersonalityRequest {
  userId: string | null;
}

@Injectable()
export class GeneratePersonalityUseCase {
  constructor(
    @Inject("COOMB_AI_CLIENT_PORT")
    private readonly aiClient: CoombAIClientPort,
    @Inject("USER_REPOSITORY_PORT")
    private readonly userRepository: UserRepositoryPort,
    @Inject("RESUME_REPOSITORY_PORT")
    private readonly resumeRepository: ResumeRepositoryPort
  ) {}

  async execute(request: GeneratePersonalityRequest): Promise<GeneratePersonalityResult> {
    let userData: any = null;

    if (request.userId) {
      const user = await this.userRepository.findById(request.userId);
      const resume = await this.resumeRepository.findByUserId(request.userId);

      if (user && resume) {
        userData = {
          professional_summary: user.professional_summary,
          career_goals: user.career_goals,
          experiences: resume.experiences || [],
          skills: resume.skills || [],
        };
      }
    }

    return this.aiClient.generatePersonality(request.userId, userData);
  }
}

