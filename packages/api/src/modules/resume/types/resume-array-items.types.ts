import { CreateExperienceDto } from "../dtos/create-experience.dto";
import { CreateSkillDto } from "../dtos/create-skill.dto";
import { CreateLanguageDto } from "../dtos/create-language.dto";
import { CreateEducationDto } from "../dtos/create-education.dto";
import { CreateCertificationDto } from "../dtos/create-certification.dto";

export interface Experience extends CreateExperienceDto {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill extends CreateSkillDto {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Language extends CreateLanguageDto {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Education extends CreateEducationDto {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Certification extends CreateCertificationDto {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type ResumeArrayItem = Experience | Skill | Language | Education | Certification;

