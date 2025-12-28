import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class TransferSessionDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  sessionId!: string;
}
