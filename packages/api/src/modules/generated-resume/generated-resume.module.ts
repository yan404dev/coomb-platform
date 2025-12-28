import { Module } from "@nestjs/common";
import { PrismaModule } from "../../common/prisma/prisma.module";
import { GeneratedResumeController } from "./generated-resume.controller";
import { GeneratedResumeService } from "./generated-resume.service";

@Module({
  imports: [PrismaModule],
  controllers: [GeneratedResumeController],
  providers: [GeneratedResumeService],
  exports: [GeneratedResumeService],
})
export class GeneratedResumeModule { }
