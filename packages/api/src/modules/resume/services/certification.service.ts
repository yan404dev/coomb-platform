import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../common/prisma/prisma.service";
import { ResumeService } from "../resume.service";
import { CreateCertificationDto, UpdateCertificationDto } from "../dtos/create-certification.dto";
import { Certification } from "../entities/certification.entity";

@Injectable()
export class CertificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly resumeService: ResumeService
  ) { }

  async add(userId: string, data: CreateCertificationDto): Promise<Certification> {
    const resume = await this.resumeService.findUserResume(userId);

    return this.prisma.certification.create({
      data: {
        ...data,
        resume_id: resume.id,
      },
    });
  }

  async update(
    userId: string,
    certificationId: string,
    data: UpdateCertificationDto
  ): Promise<Certification> {
    const resume = await this.resumeService.findUserResume(userId);

    const certification = await this.prisma.certification.findFirst({
      where: {
        id: certificationId,
        resume_id: resume.id,
      },
    });

    if (!certification) {
      throw new NotFoundException("Certification não encontrada");
    }

    return this.prisma.certification.update({
      where: { id: certificationId },
      data,
    });
  }

  async delete(userId: string, certificationId: string): Promise<void> {
    const resume = await this.resumeService.findUserResume(userId);

    const certification = await this.prisma.certification.findFirst({
      where: {
        id: certificationId,
        resume_id: resume.id,
      },
    });

    if (!certification) {
      throw new NotFoundException("Certification não encontrada");
    }

    await this.prisma.certification.delete({
      where: { id: certificationId },
    });
  }
}
