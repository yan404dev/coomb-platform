import type { Skill } from "@/shared/entities";
import type { CreateSkillInput } from "@/shared/schemas/resume.schema";
import {
  addSkillAction,
  updateSkillAction,
  deleteSkillAction,
} from "../_actions/resume.actions";

class SkillService {
  async add(data: CreateSkillInput): Promise<void> {
    await addSkillAction(data);
  }

  async update(skillId: string, data: Partial<Omit<Skill, "id" | "createdAt" | "updatedAt">>): Promise<void> {
    await updateSkillAction(skillId, data);
  }

  async updateLevel(skillId: string, level: Skill["level"]): Promise<void> {
    await updateSkillAction(skillId, { level: level ?? undefined });
  }

  async delete(skillId: string): Promise<void> {
    await deleteSkillAction(skillId);
  }
}

export const skillService = new SkillService();
