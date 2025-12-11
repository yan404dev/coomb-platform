import type { Education } from "@/shared/entities";
import type { CreateEducationInput } from "@/shared/schemas/resume.schema";
import {
  addEducationAction,
  updateEducationAction,
  deleteEducationAction,
} from "../_actions/resume.actions";

class EducationService {
  async add(data: CreateEducationInput): Promise<void> {
    await addEducationAction(data);
  }

  async update(
    educationId: string,
    data: Partial<Omit<Education, "id" | "createdAt" | "updatedAt">>
  ): Promise<void> {
    await updateEducationAction(educationId, data);
  }

  async delete(educationId: string): Promise<void> {
    await deleteEducationAction(educationId);
  }
}

export const educationService = new EducationService();
