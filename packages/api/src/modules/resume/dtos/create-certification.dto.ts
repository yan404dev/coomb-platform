import { IsString, IsOptional, IsDateString } from "class-validator";

export class CreateCertificationDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  institution?: string;

  @IsString()
  @IsDateString()
  @IsOptional()
  completionDate?: string;
}

export class UpdateCertificationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  institution?: string;

  @IsString()
  @IsDateString()
  @IsOptional()
  completionDate?: string;
}

