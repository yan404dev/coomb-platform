import { Module } from "@nestjs/common";
import { PrismaModule } from "../../common/prisma/prisma.module";
import { ResumeController } from "./controllers/resume.controller";
import { ResumeService } from "./application/services/resume.service";
import { CompletionScoreService } from "./services/completion-score.service";
import { ResumeRepository } from "./repositories/resume.repository";
import { ResumeRepositoryAdapter } from "./infrastructure/adapters/resume.repository.adapter";
import { CreateResumeUseCase } from "./application/use-cases/create-resume.use-case";
import { GetResumeUseCase } from "./application/use-cases/get-resume.use-case";
import { UpdateResumeUseCase } from "./application/use-cases/update-resume.use-case";
import { ExperienceService } from "./services/experience.service";
import { SkillService } from "./services/skill.service";
import { LanguageService } from "./services/language.service";
import { EducationService } from "./services/education.service";
import { CertificationService } from "./services/certification.service";
import { INJECTION_TOKENS } from "../../common/constants/injection-tokens";

@Module({
  imports: [PrismaModule],
  controllers: [ResumeController],
  providers: [
    ResumeService,
    CompletionScoreService,
    ResumeRepository,
    ResumeRepositoryAdapter,
    CreateResumeUseCase,
    GetResumeUseCase,
    UpdateResumeUseCase,
    {
      provide: INJECTION_TOKENS.RESUME_REPOSITORY_PORT,
      useClass: ResumeRepositoryAdapter,
    },
    ExperienceService,
    SkillService,
    LanguageService,
    EducationService,
    CertificationService,
  ],
  exports: [
    ResumeService,
    ResumeRepository,
    INJECTION_TOKENS.RESUME_REPOSITORY_PORT,
    ExperienceService,
    SkillService,
    LanguageService,
    EducationService,
    CertificationService,
  ],
})
export class ResumeModule {}
