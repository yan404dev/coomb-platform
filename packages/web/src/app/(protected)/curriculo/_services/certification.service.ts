import type { Certification } from "@/shared/types";
import {
  addCertificationAction,
  updateCertificationAction,
  deleteCertificationAction,
} from "../_actions/resume.actions";

class CertificationService {
  async add(
    data: Omit<Certification, "id" | "createdAt" | "updatedAt">
  ): Promise<void> {
    await addCertificationAction(data);
  }

  async update(
    certificationId: string,
    data: Partial<Omit<Certification, "id">>
  ): Promise<void> {
    await updateCertificationAction(certificationId, data);
  }

  async delete(certificationId: string): Promise<void> {
    await deleteCertificationAction(certificationId);
  }
}

export const certificationService = new CertificationService();
