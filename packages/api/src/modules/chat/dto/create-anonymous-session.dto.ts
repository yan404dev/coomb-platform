import { IsOptional, IsString } from "class-validator";

export class CreateAnonymousSessionDto {
  @IsOptional()
  @IsString()
  source?: string;
}
