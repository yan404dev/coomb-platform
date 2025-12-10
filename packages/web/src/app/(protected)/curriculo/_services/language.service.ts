import type { Language } from "@/shared/types";
import {
  addLanguageAction,
  updateLanguageAction,
  deleteLanguageAction,
} from "../_actions/resume.actions";

class LanguageService {
  async add(data: Omit<Language, "id" | "createdAt" | "updatedAt">): Promise<void> {
    await addLanguageAction(data);
  }

  async update(
    languageId: string,
    data: Partial<Omit<Language, "id">>
  ): Promise<void> {
    await updateLanguageAction(languageId, data);
  }

  async updateLevel(
    languageId: string,
    level: Language["level"]
  ): Promise<void> {
    await updateLanguageAction(languageId, { level: level ?? undefined });
  }

  async delete(languageId: string): Promise<void> {
    await deleteLanguageAction(languageId);
  }
}

export const languageService = new LanguageService();
