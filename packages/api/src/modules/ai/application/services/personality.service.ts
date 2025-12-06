import { Injectable, Inject } from "@nestjs/common";
import { GeneratePersonalityUseCase } from "../use-cases/generate-personality.use-case";
import { UserRepositoryPort } from "../../../user/domain/ports/user.repository.port";
import { INJECTION_TOKENS } from "../../../../common/constants/injection-tokens";

export interface PersonalityProfile {
  executor: number;
  comunicador: number;
  planejador: number;
  analista: number;
  description?: string;
}

export interface GeneratePersonalityResponse {
  personality: PersonalityProfile;
  timestamp: string;
}

@Injectable()
export class AIPersonalityService {
  constructor(
    private readonly generatePersonalityUseCase: GeneratePersonalityUseCase,
    @Inject(INJECTION_TOKENS.USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort
  ) {}

  async generatePersonality(userId: string | null): Promise<GeneratePersonalityResponse> {
    const result = await this.generatePersonalityUseCase.execute({ userId });

    if (userId && result.personality) {
      await this.userRepository.update(userId, {
        personality_profile: result.personality,
      });
    }

    return result;
  }
}

