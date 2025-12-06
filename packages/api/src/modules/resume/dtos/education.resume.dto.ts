import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class EducationResumeDto {
  @IsString()
  @IsNotEmpty()
  degree!: string;

  @IsString()
  @IsNotEmpty()
  institution!: string;

  @IsString()
  @IsNotEmpty()
  startDate!: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  current?: boolean;
}
