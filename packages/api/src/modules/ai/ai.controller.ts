import { Controller, Post, UseGuards, Request } from "@nestjs/common";
import { OptionalJwtAuthGuard } from "../auth/guards/optional-jwt-auth.guard";
import { AIPersonalityService } from "./personality.service";

@Controller("api/v1/ai")
export class AIController {
  constructor(private readonly personalityService: AIPersonalityService) { }

  @Post("generate-personality")
  @UseGuards(OptionalJwtAuthGuard)
  async generatePersonality(@Request() req: any) {
    return this.personalityService.generatePersonality(req.user?.id);
  }
}
