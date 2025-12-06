export const DEFAULT_RESUME_DATA = {
  experiences: [],
  skills: [],
  languages: [],
  educations: [],
  certifications: [],
  completion_score: 0,
} as const;

export const RESUME_INCLUDE = {
  user: {
    select: {
      id: true,
      email: true,
      full_name: true,
      phone: true,
      cpf: true,
      birth_date: true,
      has_disability: true,
      race: true,
      sexual_orientation: true,
      gender: true,
      state: true,
      city: true,
      salary_expectation: true,
      has_cnh: true,
      instagram: true,
      facebook: true,
      linkedin: true,
      portfolio: true,
      professional_summary: true,
      career_goals: true,
      personality_profile: true,
      personality_generated_at: true,
    },
  },
} as const;
