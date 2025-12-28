import { IsOptional, IsString, IsEmail, IsBoolean, ValidateNested, ValidateIf } from "class-validator";
import { Type } from "class-transformer";
import { IsValidCPF, IsValidPhone, IsValidURL } from "../../../common/validators/format.validators";

class PersonalityProfileDto {
  executor!: number;
  comunicador!: number;
  planejador!: number;
  analista!: number;
  description?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @ValidateIf((o) => o.email !== "")
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsValidPhone()
  phone?: string;

  @IsOptional()
  @IsString()
  @IsValidCPF()
  cpf?: string;

  @IsOptional()
  @IsString()
  birth_date?: string;

  @IsOptional()
  @IsBoolean()
  has_disability?: boolean;

  @IsOptional()
  @IsString()
  race?: string;

  @IsOptional()
  @IsString()
  sexual_orientation?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  salary_expectation?: string;

  @IsOptional()
  @IsBoolean()
  has_cnh?: boolean;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  @IsValidURL()
  linkedin?: string;

  @IsOptional()
  @IsString()
  @IsValidURL()
  portfolio?: string;

  @IsOptional()
  @IsString()
  professional_summary?: string;

  @IsOptional()
  @IsString()
  career_goals?: string;

  @ValidateNested()
  @Type(() => PersonalityProfileDto)
  @IsOptional()
  personality_profile?: PersonalityProfileDto;

  @IsOptional()
  @IsString()
  planType?: string;

  @IsOptional()
  @IsString()
  defaultTemplateId?: string;

  @IsOptional()
  settings?: any;
}
