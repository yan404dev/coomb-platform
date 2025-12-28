import { Module } from "@nestjs/common";
import { PrismaModule } from "../../common/prisma/prisma.module";
import { ResumeController } from "./resume.controller";
import { ResumeService } from "./resume.service";
import { ExperienceService } from "./services/experience.service";
import { SkillService } from "./services/skill.service";
import { LanguageService } from "./services/language.service";
import { EducationService } from "./services/education.service";
import { CertificationService } from "./services/certification.service";

@Module({
  imports: [PrismaModule],
  controllers: [ResumeController],
  providers: [
    ResumeService,
    ExperienceService,
    SkillService,
    LanguageService,
    EducationService,
    CertificationService,
  ],
  exports: [
    ResumeService,
    ExperienceService,
    SkillService,
    LanguageService,
    EducationService,
    CertificationService,
  ],
})
export class ResumeModule { }
