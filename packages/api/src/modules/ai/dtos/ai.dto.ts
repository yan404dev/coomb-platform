import { PersonalityProfile } from "../entities/ai.entity";

export class GeneratePersonalityResponseDto {
  personality!: PersonalityProfile;
  timestamp!: string;
}
