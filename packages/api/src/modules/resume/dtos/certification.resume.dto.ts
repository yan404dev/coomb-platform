import { IsNotEmpty, IsString } from "class-validator";

export class CertificationResumeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  institution!: string;

  @IsString()
  @IsNotEmpty()
  completionDate!: string;
}
