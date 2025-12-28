import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../common/prisma/prisma.service";
import { ResumeService } from "../resume.service";
import { CreateSkillDto, UpdateSkillDto } from "../dtos/create-skill.dto";
import { Skill } from "../entities/skill.entity";

@Injectable()
export class SkillService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly resumeService: ResumeService
  ) { }

  async add(userId: string, data: CreateSkillDto): Promise<Skill> {
    const resume = await this.resumeService.findUserResume(userId);

    return this.prisma.skill.create({
      data: {
        ...data,
        resume_id: resume.id,
      },
    });
  }

  async update(userId: string, skillId: string, data: UpdateSkillDto): Promise<Skill> {
    const resume = await this.resumeService.findUserResume(userId);

    const skill = await this.prisma.skill.findFirst({
      where: {
        id: skillId,
        resume_id: resume.id,
      },
    });

    if (!skill) {
      throw new NotFoundException("Skill não encontrada");
    }

    return this.prisma.skill.update({
      where: { id: skillId },
      data,
    });
  }

  async delete(userId: string, skillId: string): Promise<void> {
    const resume = await this.resumeService.findUserResume(userId);

    const skill = await this.prisma.skill.findFirst({
      where: {
        id: skillId,
        resume_id: resume.id,
      },
    });

    if (!skill) {
      throw new NotFoundException("Skill não encontrada");
    }

    await this.prisma.skill.delete({
      where: { id: skillId },
    });
  }
}
