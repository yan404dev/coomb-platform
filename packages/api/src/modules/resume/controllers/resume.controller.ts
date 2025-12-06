import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { ResumeService } from "../application/services/resume.service";
import { ExperienceService } from "../services/experience.service";
import { SkillService } from "../services/skill.service";
import { LanguageService } from "../services/language.service";
import { EducationService } from "../services/education.service";
import { CertificationService } from "../services/certification.service";
import { UpdateResumeDto } from "../dtos/update-resume.dto";
import { CreateExperienceDto, UpdateExperienceDto } from "../dtos/create-experience.dto";
import { CreateSkillDto, UpdateSkillDto } from "../dtos/create-skill.dto";
import { CreateLanguageDto, UpdateLanguageDto } from "../dtos/create-language.dto";
import { CreateEducationDto, UpdateEducationDto } from "../dtos/create-education.dto";
import { CreateCertificationDto, UpdateCertificationDto } from "../dtos/create-certification.dto";

@Controller("api/v1")
export class ResumeController {
  constructor(
    private readonly resumeService: ResumeService,
    private readonly experienceService: ExperienceService,
    private readonly skillService: SkillService,
    private readonly languageService: LanguageService,
    private readonly educationService: EducationService,
    private readonly certificationService: CertificationService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post("resume")
  async createResume(@Request() req: any) {
    return this.resumeService.createResume(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("resume")
  async findUserResume(@Request() req: any) {
    return this.resumeService.findUserResume(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("resume")
  async updateResume(@Request() req: any, @Body() updateResumeDto: UpdateResumeDto) {
    return this.resumeService.updateResume(req.user.id, updateResumeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("resume/completion-details")
  async getCompletionDetails(@Request() req: any) {
    return this.resumeService.getCompletionDetails(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("resume/experiences")
  async addExperience(@Request() req: any, @Body() createExperienceDto: CreateExperienceDto) {
    return this.experienceService.add(req.user.id, createExperienceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("resume/experiences/:id")
  async updateExperience(
    @Request() req: any,
    @Param("id") experienceId: string,
    @Body() updateExperienceDto: UpdateExperienceDto
  ) {
    return this.experienceService.update(req.user.id, experienceId, updateExperienceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("resume/experiences/:id")
  async deleteExperience(@Request() req: any, @Param("id") experienceId: string) {
    return this.experienceService.delete(req.user.id, experienceId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("resume/skills")
  async addSkill(@Request() req: any, @Body() createSkillDto: CreateSkillDto) {
    return this.skillService.add(req.user.id, createSkillDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("resume/skills/:id")
  async updateSkill(
    @Request() req: any,
    @Param("id") skillId: string,
    @Body() updateSkillDto: UpdateSkillDto
  ) {
    return this.skillService.update(req.user.id, skillId, updateSkillDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("resume/skills/:id")
  async deleteSkill(@Request() req: any, @Param("id") skillId: string) {
    return this.skillService.delete(req.user.id, skillId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("resume/languages")
  async addLanguage(@Request() req: any, @Body() createLanguageDto: CreateLanguageDto) {
    return this.languageService.add(req.user.id, createLanguageDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("resume/languages/:id")
  async updateLanguage(
    @Request() req: any,
    @Param("id") languageId: string,
    @Body() updateLanguageDto: UpdateLanguageDto
  ) {
    return this.languageService.update(req.user.id, languageId, updateLanguageDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("resume/languages/:id")
  async deleteLanguage(@Request() req: any, @Param("id") languageId: string) {
    return this.languageService.delete(req.user.id, languageId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("resume/educations")
  async addEducation(@Request() req: any, @Body() createEducationDto: CreateEducationDto) {
    return this.educationService.add(req.user.id, createEducationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("resume/educations/:id")
  async updateEducation(
    @Request() req: any,
    @Param("id") educationId: string,
    @Body() updateEducationDto: UpdateEducationDto
  ) {
    return this.educationService.update(req.user.id, educationId, updateEducationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("resume/educations/:id")
  async deleteEducation(@Request() req: any, @Param("id") educationId: string) {
    return this.educationService.delete(req.user.id, educationId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("resume/certifications")
  async addCertification(
    @Request() req: any,
    @Body() createCertificationDto: CreateCertificationDto
  ) {
    return this.certificationService.add(req.user.id, createCertificationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("resume/certifications/:id")
  async updateCertification(
    @Request() req: any,
    @Param("id") certificationId: string,
    @Body() updateCertificationDto: UpdateCertificationDto
  ) {
    return this.certificationService.update(
      req.user.id,
      certificationId,
      updateCertificationDto
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete("resume/certifications/:id")
  async deleteCertification(@Request() req: any, @Param("id") certificationId: string) {
    return this.certificationService.delete(req.user.id, certificationId);
  }
}
