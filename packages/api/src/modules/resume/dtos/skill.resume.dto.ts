import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SkillResumeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  level?: string;
}
