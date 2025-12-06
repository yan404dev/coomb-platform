import { Module, forwardRef } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { AIPersonalityService } from "./application/services/personality.service";
import { GeneratePersonalityUseCase } from "./application/use-cases/generate-personality.use-case";
import { CoombAIClientAdapter } from "./infrastructure/adapters/coomb-ai-client.adapter";
import { AIController } from "./controllers/ai.controller";
import { ResumeModule } from "../resume/resume.module";
import { UserModule } from "../user/user.module";
import { INJECTION_TOKENS } from "../../common/constants/injection-tokens";

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    forwardRef(() => ResumeModule),
    forwardRef(() => UserModule),
  ],
  controllers: [AIController],
  providers: [
    AIPersonalityService,
    GeneratePersonalityUseCase,
    CoombAIClientAdapter,
    {
      provide: INJECTION_TOKENS.COOMB_AI_CLIENT_PORT,
      useClass: CoombAIClientAdapter,
    },
    {
      provide: INJECTION_TOKENS.COOMB_AI_CLIENT,
      useClass: CoombAIClientAdapter,
    },
  ],
  exports: [
    AIPersonalityService,
    CoombAIClientAdapter,
    INJECTION_TOKENS.COOMB_AI_CLIENT_PORT,
    INJECTION_TOKENS.COOMB_AI_CLIENT,
  ],
})
export class AIModule {}
