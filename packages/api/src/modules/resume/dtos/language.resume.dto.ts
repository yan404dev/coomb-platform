import { IsNotEmpty, IsString } from "class-validator";

export class LanguageResumeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  level!: string;
}
