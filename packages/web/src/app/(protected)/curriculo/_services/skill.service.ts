import type { Skill } from "@/shared/types";
import {
  deleteSkillAction,
  updateSkillAction,
} from "../_actions/resume.actions";

class SkillService {
  async delete(skillId: string): Promise<void> {
    await deleteSkillAction(skillId);
  }

  async updateLevel(skillId: string, level: Skill["level"]): Promise<void> {
    await updateSkillAction(skillId, { level: level ?? undefined });
  }
}

export const skillService = new SkillService();
