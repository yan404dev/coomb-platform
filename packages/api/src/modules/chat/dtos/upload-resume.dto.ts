import { IsString, IsOptional } from "class-validator";

export class UploadResumeDto {
  @IsOptional()
  @IsString()
  jobDescription?: string;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsString()
  sessionId?: string;
}
