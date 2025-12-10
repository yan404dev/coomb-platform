import { deleteCertificationAction } from "../_actions/resume.actions";

class CertificationService {
  async delete(certificationId: string): Promise<void> {
    await deleteCertificationAction(certificationId);
  }
}

export const certificationService = new CertificationService();
