import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ExperienceResumeDto {
  @IsString()
  @IsNotEmpty()
  position!: string;

  @IsString()
  @IsNotEmpty()
  company!: string;

  @IsString()
  @IsNotEmpty()
  startDate!: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  current?: boolean;

  @IsString()
  @IsOptional()
  description?: string;
}
