import type { Experience } from "@/shared/types";
import {
  addExperienceAction,
  updateExperienceAction,
  deleteExperienceAction,
} from "../_actions/resume.actions";

class ExperienceService {
  async add(data: Omit<Experience, "id" | "createdAt" | "updatedAt">): Promise<void> {
    await addExperienceAction(data);
  }

  async update(
    experienceId: string,
    data: Partial<Omit<Experience, "id">>
  ): Promise<void> {
    await updateExperienceAction(experienceId, data);
  }

  async delete(experienceId: string): Promise<void> {
    await deleteExperienceAction(experienceId);
  }
}

export const experienceService = new ExperienceService();
