import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PersonalityProfileDto {
  @IsInt()
  @Min(0)
  @Max(100)
  executor!: number;

  @IsInt()
  @Min(0)
  @Max(100)
  comunicador!: number;

  @IsInt()
  @Min(0)
  @Max(100)
  planejador!: number;

  @IsInt()
  @Min(0)
  @Max(100)
  analista!: number;

  @IsString()
  @IsOptional()
  description?: string;
}
