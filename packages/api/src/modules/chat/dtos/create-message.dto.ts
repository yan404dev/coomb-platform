import { IsString, IsOptional, IsUrl } from "class-validator";

export class CreateMessageDto {
  @IsString()
  content!: string;

  @IsOptional()
  @IsString()
  messageType?: string;

  @IsOptional()
  @IsUrl()
  pdf_url?: string;
}
