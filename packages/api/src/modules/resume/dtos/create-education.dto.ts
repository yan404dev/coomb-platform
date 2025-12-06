import { IsString, IsBoolean, IsOptional, IsDateString, ValidateIf } from "class-validator";

export class CreateEducationDto {
  @IsString()
  degree!: string;

  @IsString()
  institution!: string;

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
}

export class UpdateEducationDto {
  @IsString()
  @IsOptional()
  degree?: string;

  @IsString()
  @IsOptional()
  institution?: string;

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
}

