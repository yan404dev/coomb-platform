import { PartialType } from "@nestjs/mapped-types";
import { CreateGeneratedResumeDto } from "./create-generated-resume.dto";

export class UpdateGeneratedResumeDto extends PartialType(CreateGeneratedResumeDto) {}
