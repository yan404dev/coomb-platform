import { deleteExperienceAction } from "../_actions/resume.actions";

class ExperienceService {
  async delete(experienceId: string): Promise<void> {
    await deleteExperienceAction(experienceId);
  }
}

export const experienceService = new ExperienceService();
