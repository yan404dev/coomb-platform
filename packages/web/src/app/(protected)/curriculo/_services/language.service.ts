import type { Language } from "@/shared/types";
import {
  deleteLanguageAction,
  updateLanguageAction,
} from "../_actions/resume.actions";

class LanguageService {
  async delete(languageId: string): Promise<void> {
    await deleteLanguageAction(languageId);
  }

  async updateLevel(
    languageId: string,
    level: Language["level"]
  ): Promise<void> {
    await updateLanguageAction(languageId, { level: level ?? undefined });
  }
}

export const languageService = new LanguageService();
