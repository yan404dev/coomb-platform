import { Injectable } from "@nestjs/common";

interface CompletionField {
  name: string;
  weight: number;
  validator: (resume: any, user: any) => boolean;
}

@Injectable()
export class CompletionScoreService {
  private readonly fields: CompletionField[] = [
    {
      name: "full_name",
      weight: 1,
      validator: (_, user) => !!user?.full_name,
    },
    {
      name: "email",
      weight: 1,
      validator: (_, user) => !!user?.email,
    },
    {
      name: "phone",
      weight: 1,
      validator: (_, user) => !!user?.phone,
    },
    {
      name: "cpf",
      weight: 1,
      validator: (_, user) => !!user?.cpf,
    },
    {
      name: "birth_date",
      weight: 1,
      validator: (_, user) => !!user?.birth_date,
    },
    {
      name: "has_disability",
      weight: 1,
      validator: (_, user) =>
        user?.has_disability !== null && user?.has_disability !== undefined,
    },
    {
      name: "race",
      weight: 1,
      validator: (_, user) => !!user?.race,
    },
    {
      name: "sexual_orientation",
      weight: 1,
      validator: (_, user) => !!user?.sexual_orientation,
    },
    {
      name: "gender",
      weight: 1,
      validator: (_, user) => !!user?.gender,
    },
    {
      name: "city",
      weight: 1,
      validator: (_, user) => !!user?.city,
    },
    {
      name: "state",
      weight: 1,
      validator: (_, user) => !!user?.state,
    },
    {
      name: "linkedin",
      weight: 1,
      validator: (_, user) => !!user?.linkedin,
    },
    {
      name: "professional_summary",
      weight: 1,
      validator: (_, user) => !!user?.professional_summary,
    },
    {
      name: "career_goals",
      weight: 1,
      validator: (_, user) => !!user?.career_goals,
    },
    {
      name: "experiences",
      weight: 2,
      validator: (resume) =>
        Array.isArray(resume?.experiences) && resume.experiences.length > 0,
    },
    {
      name: "skills",
      weight: 2,
      validator: (resume) =>
        Array.isArray(resume?.skills) && resume.skills.length > 0,
    },
    {
      name: "languages",
      weight: 1,
      validator: (resume) =>
        Array.isArray(resume?.languages) && resume.languages.length > 0,
    },
    {
      name: "educations",
      weight: 2,
      validator: (resume) =>
        Array.isArray(resume?.educations) && resume.educations.length > 0,
    },
    {
      name: "certifications",
      weight: 1,
      validator: (resume) =>
        Array.isArray(resume?.certifications) &&
        resume.certifications.length > 0,
    },
  ];

  calculate(resume: any, user: any): number {
    const totalWeight = this.fields.reduce(
      (sum, field) => sum + field.weight,
      0,
    );

    const achievedWeight = this.fields
      .filter((field) => field.validator(resume, user))
      .reduce((sum, field) => sum + field.weight, 0);

    return Math.round((achievedWeight / totalWeight) * 100);
  }

  getDetails(resume: any, user: any) {
    const totalWeight = this.fields.reduce(
      (sum, field) => sum + field.weight,
      0,
    );

    const fieldDetails = this.fields.map((field) => ({
      name: field.name,
      weight: field.weight,
      filled: field.validator(resume, user),
    }));

    const achievedWeight = fieldDetails
      .filter((f) => f.filled)
      .reduce((sum, f) => sum + f.weight, 0);

    return {
      total: this.fields.length,
      filled: fieldDetails.filter((f) => f.filled).length,
      percentage: Math.round((achievedWeight / totalWeight) * 100),
      fields: fieldDetails,
    };
  }

  addField(field: CompletionField): void {
    this.fields.push(field);
  }

  removeField(fieldName: string): void {
    const index = this.fields.findIndex((f) => f.name === fieldName);
    if (index !== -1) {
      this.fields.splice(index, 1);
    }
  }

  updateFieldWeight(fieldName: string, newWeight: number): void {
    const field = this.fields.find((f) => f.name === fieldName);
    if (field) {
      field.weight = newWeight;
    }
  }
}
