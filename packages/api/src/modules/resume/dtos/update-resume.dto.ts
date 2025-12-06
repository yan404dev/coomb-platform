import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ExperienceResumeDto } from './experience.resume.dto';
import { SkillResumeDto } from './skill.resume.dto';
import { LanguageResumeDto } from './language.resume.dto';
import { EducationResumeDto } from './education.resume.dto';
import { CertificationResumeDto } from './certification.resume.dto';

export class UpdateResumeDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceResumeDto)
  @IsOptional()
  experiences?: ExperienceResumeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillResumeDto)
  @IsOptional()
  skills?: SkillResumeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageResumeDto)
  @IsOptional()
  languages?: LanguageResumeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationResumeDto)
  @IsOptional()
  educations?: EducationResumeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificationResumeDto)
  @IsOptional()
  certifications?: CertificationResumeDto[];
}
