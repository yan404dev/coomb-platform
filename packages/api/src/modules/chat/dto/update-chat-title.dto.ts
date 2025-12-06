import { IsString, MaxLength } from "class-validator";

export class UpdateChatTitleDto {
  @IsString()
  @MaxLength(255)
  title!: string;
}
