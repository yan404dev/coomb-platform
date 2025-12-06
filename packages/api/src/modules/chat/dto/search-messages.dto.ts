import { IsString, IsUUID } from "class-validator";

export class SearchMessagesDto {
  @IsUUID()
  chatId!: string;

  @IsString()
  query!: string;
}
