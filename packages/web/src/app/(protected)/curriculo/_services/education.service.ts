import { deleteEducationAction } from "../_actions/resume.actions";

class EducationService {
  async delete(educationId: string): Promise<void> {
    await deleteEducationAction(educationId);
  }
}

export const educationService = new EducationService();
