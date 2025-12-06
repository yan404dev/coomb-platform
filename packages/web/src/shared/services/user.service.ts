import { api } from "@/shared/lib/api";

export interface UpdateUserPayload {
  full_name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  birth_date?: string;
  has_disability?: boolean;
  race?: string;
  sexual_orientation?: string;
  gender?: string;
  state?: string;
  city?: string;
  salary_expectation?: string;
  has_cnh?: boolean;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  portfolio?: string;
  professional_summary?: string;
  career_goals?: string;
}

export const userService = {
  async update(userId: string, data: UpdateUserPayload): Promise<void> {
    await api.patch(`/api/v1/users/${userId}`, data);
  },
};
