import { IsString, IsOptional } from "class-validator";

export class CreateSkillDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  level?: string;
}

export class UpdateSkillDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  level?: string;
}
