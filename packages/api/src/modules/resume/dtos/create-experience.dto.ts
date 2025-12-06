import { IsString, IsBoolean, IsOptional, IsDateString, ValidateIf } from "class-validator";

export class CreateExperienceDto {
  @IsString()
  position!: string;

  @IsString()
  company!: string;

  @IsString()
  @IsDateString()
  startDate!: string;

  @ValidateIf((o) => !o.current)
  @IsString()
  @IsDateString()
  @IsOptional()
  endDate?: string | null;

  @IsBoolean()
  current!: boolean;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateExperienceDto {
  @IsString()
  @IsOptional()
  position?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ValidateIf((o) => !o.current)
  @IsString()
  @IsDateString()
  @IsOptional()
  endDate?: string | null;

  @IsBoolean()
  @IsOptional()
  current?: boolean;

  @IsString()
  @IsOptional()
  description?: string;
}

