import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateGeneratedResumeDto {
  @IsNotEmpty()
  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  title?: string;
}
