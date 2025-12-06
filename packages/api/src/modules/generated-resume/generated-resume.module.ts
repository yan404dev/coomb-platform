import { Module } from "@nestjs/common";
import { PrismaModule } from "../../common/prisma/prisma.module";
import { GeneratedResumeController } from "./controllers/generated-resume.controller";
import { GeneratedResumeService } from "./application/services/generated-resume.service";
import { GeneratedResumeRepositoryAdapter } from "./infrastructure/adapters/generated-resume.repository.adapter";

@Module({
  imports: [PrismaModule],
  controllers: [GeneratedResumeController],
  providers: [
    GeneratedResumeService,
    GeneratedResumeRepositoryAdapter,
    {
      provide: "GENERATED_RESUME_REPOSITORY_PORT",
      useClass: GeneratedResumeRepositoryAdapter,
    },
  ],
  exports: [GeneratedResumeService, "GENERATED_RESUME_REPOSITORY_PORT"],
})
export class GeneratedResumeModule {}
