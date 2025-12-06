import { IsString, IsEnum, IsOptional, IsUrl } from "class-validator";

export enum MessageType {
  USER = "user",
  ASSISTANT = "assistant",
}

export class CreateMessageDto {
  @IsString()
  content!: string;

  @IsEnum(MessageType)
  messageType!: MessageType;

  @IsOptional()
  @IsUrl()
  pdf_url?: string;
}

