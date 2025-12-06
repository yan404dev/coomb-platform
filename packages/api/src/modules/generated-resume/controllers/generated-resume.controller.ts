import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { GeneratedResumeService } from "../application/services/generated-resume.service";
import { CreateGeneratedResumeDto } from "../dto/create-generated-resume.dto";
import { UpdateGeneratedResumeDto } from "../dto/update-generated-resume.dto";

@Controller("api/v1/generated-resumes")
export class GeneratedResumeController {
  constructor(private readonly generatedResumeService: GeneratedResumeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req: any,
    @Body() createGeneratedResumeDto: CreateGeneratedResumeDto
  ) {
    return this.generatedResumeService.create(
      req.user.id,
      createGeneratedResumeDto
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req: any, @Query("baseResumeId") baseResumeId?: string) {
    return this.generatedResumeService.findAll(req.user.id, baseResumeId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(@Param("id") id: string, @Request() req: any) {
    return this.generatedResumeService.findOne(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateGeneratedResumeDto: UpdateGeneratedResumeDto,
    @Request() req: any
  ) {
    return this.generatedResumeService.update(
      id,
      req.user.id,
      updateGeneratedResumeDto
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Param("id") id: string, @Request() req: any) {
    await this.generatedResumeService.delete(id, req.user.id);
    return { message: "Generated resume deleted successfully" };
  }
}
