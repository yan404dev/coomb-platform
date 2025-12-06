import { Injectable, NotFoundException } from "@nestjs/common";
import { ResumeRepository } from "../repositories/resume.repository";
import { CompletionScoreService } from "./completion-score.service";
import { RESUME_INCLUDE } from "../constants/resume.constants";
import { CreateCertificationDto, UpdateCertificationDto } from "../dtos/create-certification.dto";
import { ResumeEntity } from "../entities/resume.entity";
import { Certification } from "../types/resume-array-items.types";
import { randomUUID } from "crypto";
import { recalculateCompletionScore } from "../utils/resume-completion.helper";
import { toJsonValue, fromJsonValue } from "../utils/json-value.helper";

@Injectable()
export class CertificationService {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly completionScoreService: CompletionScoreService
  ) {}

  async add(userId: string, data: CreateCertificationDto): Promise<ResumeEntity> {
    return this.resumeRepository
      .transaction(async (tx) => {
        const resume = await tx.resume.findFirst({
          where: { user_id: userId },
          include: RESUME_INCLUDE,
        });

        if (!resume) {
          throw new NotFoundException("Resumo não encontrado");
        }

        const certifications = fromJsonValue<Certification>(resume.certifications);

        const newCertification: Certification = {
          id: randomUUID(),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const updatedResume = await tx.resume.update({
          where: { id: resume.id },
          data: {
            certifications: toJsonValue([...certifications, newCertification]),
          },
          include: RESUME_INCLUDE,
        });

        return recalculateCompletionScore(tx, updatedResume, this.completionScoreService);
      })
      .then((resume) => new ResumeEntity(resume));
  }

  async update(
    userId: string,
    certificationId: string,
    data: UpdateCertificationDto
  ): Promise<ResumeEntity> {
    return this.resumeRepository
      .transaction(async (tx) => {
        const resume = await tx.resume.findFirst({
          where: { user_id: userId },
          include: RESUME_INCLUDE,
        });

        if (!resume) {
          throw new NotFoundException("Resumo não encontrado");
        }

        const certifications = fromJsonValue<Certification>(resume.certifications);

        const index = certifications.findIndex(
          (cert) => cert.id === certificationId
        );

        if (index === -1) {
          throw new NotFoundException("Certificação não encontrada");
        }

        certifications[index] = {
          ...certifications[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };

        const updatedResume = await tx.resume.update({
          where: { id: resume.id },
          data: {
            certifications: toJsonValue(certifications),
          },
          include: RESUME_INCLUDE,
        });

        return recalculateCompletionScore(tx, updatedResume, this.completionScoreService);
      })
      .then((resume) => new ResumeEntity(resume));
  }

  async delete(userId: string, certificationId: string): Promise<ResumeEntity> {
    return this.resumeRepository
      .transaction(async (tx) => {
        const resume = await tx.resume.findFirst({
          where: { user_id: userId },
          include: RESUME_INCLUDE,
        });

        if (!resume) {
          throw new NotFoundException("Resumo não encontrado");
        }

        const certifications = fromJsonValue<Certification>(resume.certifications);

        const filtered = certifications.filter(
          (cert) => cert.id !== certificationId
        );

        if (filtered.length === certifications.length) {
          throw new NotFoundException("Certificação não encontrada");
        }

        const updatedResume = await tx.resume.update({
          where: { id: resume.id },
          data: {
            certifications: toJsonValue(filtered),
          },
          include: RESUME_INCLUDE,
        });

        return recalculateCompletionScore(tx, updatedResume, this.completionScoreService);
      })
      .then((resume) => new ResumeEntity(resume));
  }

}

