import { IsString, IsOptional } from "class-validator";

export class CreateLanguageDto {
  @IsString()
  name!: string;

  @IsString()
  level!: string;
}

export class UpdateLanguageDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  level?: string;
}

