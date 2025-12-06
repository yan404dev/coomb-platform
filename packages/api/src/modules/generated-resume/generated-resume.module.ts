import { Module } from "@nestjs/common";
import { PrismaModule } from "../../common/prisma/prisma.module";
import { GeneratedResumeController } from "./controllers/generated-resume.controller";
import { GeneratedResumeService } from "./application/services/generated-resume.service";
import { GeneratedResumeRepositoryAdapter } from "./infrastructure/adapters/generated-resume.repository.adapter";
import { INJECTION_TOKENS } from "../../common/constants/injection-tokens";

@Module({
  imports: [PrismaModule],
  controllers: [GeneratedResumeController],
  providers: [
    GeneratedResumeService,
    GeneratedResumeRepositoryAdapter,
    {
      provide: INJECTION_TOKENS.GENERATED_RESUME_REPOSITORY_PORT,
      useClass: GeneratedResumeRepositoryAdapter,
    },
  ],
  exports: [GeneratedResumeService, INJECTION_TOKENS.GENERATED_RESUME_REPOSITORY_PORT],
})
export class GeneratedResumeModule {}
