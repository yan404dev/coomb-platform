import { Module, forwardRef } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { ChatAIService } from "./application/services/chat-ai.service";
import { UserContextService } from "./application/services/user-context.service";
import { ResumeOptimizationService } from "./application/services/resume-optimization.service";
import { AIPersonalityService } from "./application/services/personality.service";
import { OptimizeResumeUseCase } from "./application/use-cases/optimize-resume.use-case";
import { GeneratePersonalityUseCase } from "./application/use-cases/generate-personality.use-case";
import { CoombAIClientAdapter } from "./infrastructure/adapters/coomb-ai-client.adapter";
import { AIController } from "./controllers/ai.controller";
import { ResumeModule } from "../resume/resume.module";
import { UserModule } from "../user/user.module";
import { GeneratedResumeModule } from "../generated-resume/generated-resume.module";

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    forwardRef(() => ResumeModule),
    forwardRef(() => UserModule),
    forwardRef(() => GeneratedResumeModule),
  ],
  controllers: [AIController],
  providers: [
    ChatAIService,
    UserContextService,
    ResumeOptimizationService,
    AIPersonalityService,
    OptimizeResumeUseCase,
    GeneratePersonalityUseCase,
    CoombAIClientAdapter,
    {
      provide: "COOMB_AI_CLIENT_PORT",
      useClass: CoombAIClientAdapter,
    },
    {
      provide: "COOMB_AI_CLIENT",
      useClass: CoombAIClientAdapter,
    },
  ],
  exports: [
    ChatAIService,
    UserContextService,
    ResumeOptimizationService,
    AIPersonalityService,
    CoombAIClientAdapter,
    "COOMB_AI_CLIENT_PORT",
    "COOMB_AI_CLIENT",
  ],
})
export class AIModule {}
