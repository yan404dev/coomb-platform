import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { GeneratedResumeService } from "./generated-resume.service";
import { CreateGeneratedResumeDto } from "./dtos/create-generated-resume.dto";
import { UpdateGeneratedResumeDto } from "./dtos/update-generated-resume.dto";

@Controller("api/v1/generated-resumes")
export class GeneratedResumeController {
  constructor(private readonly generatedResumeService: GeneratedResumeService) { }

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
  async findAll(
    @Request() req: any,
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.generatedResumeService.findAll(req.user.id, pageNum, limitNum);
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
    await this.generatedResumeService.remove(id, req.user.id);
    return { message: "Generated resume deleted successfully" };
  }
}
