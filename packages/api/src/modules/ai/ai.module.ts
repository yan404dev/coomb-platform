import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { PrismaModule } from "../../common/prisma/prisma.module";
import { AIPersonalityService } from "./personality.service";
import { CoombAIClientAdapter } from "./ai.service";
import { AIController } from "./ai.controller";
import { INJECTION_TOKENS } from "../../common/constants/injection-tokens";

@Module({
  imports: [ConfigModule, HttpModule, PrismaModule],
  controllers: [AIController],
  providers: [
    AIPersonalityService,
    CoombAIClientAdapter,
    {
      provide: INJECTION_TOKENS.COOMB_AI_CLIENT_PORT,
      useClass: CoombAIClientAdapter,
    },
  ],
  exports: [
    AIPersonalityService,
    CoombAIClientAdapter,
    INJECTION_TOKENS.COOMB_AI_CLIENT_PORT,
  ],
})
export class AIModule { }
