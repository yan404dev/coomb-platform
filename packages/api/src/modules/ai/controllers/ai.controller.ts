import { Controller, Post, UseGuards, Request } from "@nestjs/common";
import { OptionalJwtAuthGuard } from "../../auth/guards/optional-jwt-auth.guard";
import { AIPersonalityService } from "../application/services/personality.service";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

@Controller("api/v1/ai")
export class AIController {
  constructor(private readonly personalityService: AIPersonalityService) {}

  @Post("generate-personality")
  @UseGuards(OptionalJwtAuthGuard)
  async generatePersonality(@Request() req: AuthenticatedRequest) {
    const userId = req.user?.id || null;
    return this.personalityService.generatePersonality(userId);
  }
}

