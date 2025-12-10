import type { Education } from "@/shared/types";
import {
  addEducationAction,
  updateEducationAction,
  deleteEducationAction,
} from "../_actions/resume.actions";

class EducationService {
  async add(data: Omit<Education, "id" | "createdAt" | "updatedAt">): Promise<void> {
    await addEducationAction(data);
  }

  async update(
    educationId: string,
    data: Partial<Omit<Education, "id">>
  ): Promise<void> {
    await updateEducationAction(educationId, data);
  }

  async delete(educationId: string): Promise<void> {
    await deleteEducationAction(educationId);
  }
}

export const educationService = new EducationService();
