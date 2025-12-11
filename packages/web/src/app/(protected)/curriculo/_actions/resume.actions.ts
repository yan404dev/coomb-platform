"use server";

import { revalidatePath } from "next/cache";
import { serverApi } from "@/shared/lib/server-api";
import type {
  Resume,
  Experience,
  Skill,
  Language,
  Education,
  Certification,
} from "@/shared/entities";

const BASE_URL = "/api/v1/resume";

function revalidateResume() {
  revalidatePath("/curriculo");
  revalidatePath("/perfil");
}

export async function addExperienceAction(
  data: Omit<Experience, "id" | "createdAt" | "updatedAt">
): Promise<Resume> {
  const result = await serverApi.post<Resume>(`${BASE_URL}/experiences`, data);
  revalidateResume();
  return result;
}

export async function updateExperienceAction(
  experienceId: string,
  data: Partial<Omit<Experience, "id">>
): Promise<Resume> {
  const result = await serverApi.patch<Resume>(`${BASE_URL}/experiences/${experienceId}`, data);
  revalidateResume();
  return result;
}

export async function deleteExperienceAction(experienceId: string): Promise<Resume> {
  const result = await serverApi.delete<Resume>(`${BASE_URL}/experiences/${experienceId}`);
  revalidateResume();
  return result;
}

export async function addSkillAction(data: { name: string; level?: any }): Promise<Resume> {
  const result = await serverApi.post<Resume>(`${BASE_URL}/skills`, data);
  revalidateResume();
  return result;
}

export async function updateSkillAction(
  skillId: string,
  data: Partial<Omit<Skill, "id">>
): Promise<Resume> {
  const result = await serverApi.patch<Resume>(`${BASE_URL}/skills/${skillId}`, data);
  revalidateResume();
  return result;
}

export async function deleteSkillAction(skillId: string): Promise<Resume> {
  const result = await serverApi.delete<Resume>(`${BASE_URL}/skills/${skillId}`);
  revalidateResume();
  return result;
}

export async function addLanguageAction(data: { name: string; level?: any }): Promise<Resume> {
  const result = await serverApi.post<Resume>(`${BASE_URL}/languages`, data);
  revalidateResume();
  return result;
}

export async function updateLanguageAction(
  languageId: string,
  data: Partial<Omit<Language, "id">>
): Promise<Resume> {
  const result = await serverApi.patch<Resume>(`${BASE_URL}/languages/${languageId}`, data);
  revalidateResume();
  return result;
}

export async function deleteLanguageAction(languageId: string): Promise<Resume> {
  const result = await serverApi.delete<Resume>(`${BASE_URL}/languages/${languageId}`);
  revalidateResume();
  return result;
}

export async function addEducationAction(
  data: Omit<Education, "id" | "createdAt" | "updatedAt">
): Promise<Resume> {
  const result = await serverApi.post<Resume>(`${BASE_URL}/educations`, data);
  revalidateResume();
  return result;
}

export async function updateEducationAction(
  educationId: string,
  data: Partial<Omit<Education, "id">>
): Promise<Resume> {
  const result = await serverApi.patch<Resume>(`${BASE_URL}/educations/${educationId}`, data);
  revalidateResume();
  return result;
}

export async function deleteEducationAction(educationId: string): Promise<Resume> {
  const result = await serverApi.delete<Resume>(`${BASE_URL}/educations/${educationId}`);
  revalidateResume();
  return result;
}

export async function addCertificationAction(
  data: Omit<Certification, "id" | "createdAt" | "updatedAt">
): Promise<Resume> {
  const result = await serverApi.post<Resume>(`${BASE_URL}/certifications`, data);
  revalidateResume();
  return result;
}

export async function updateCertificationAction(
  certificationId: string,
  data: Partial<Omit<Certification, "id">>
): Promise<Resume> {
  const result = await serverApi.patch<Resume>(`${BASE_URL}/certifications/${certificationId}`, data);
  revalidateResume();
  return result;
}

export async function deleteCertificationAction(certificationId: string): Promise<Resume> {
  const result = await serverApi.delete<Resume>(`${BASE_URL}/certifications/${certificationId}`);
  revalidateResume();
  return result;
}

export async function updateResumeAction(data: {
  experiences?: Omit<Experience, "id" | "createdAt" | "updatedAt">[];
  skills?: Omit<Skill, "id" | "createdAt" | "updatedAt">[];
  languages?: Omit<Language, "id" | "createdAt" | "updatedAt">[];
  educations?: Omit<Education, "id" | "createdAt" | "updatedAt">[];
  certifications?: Omit<Certification, "id" | "createdAt" | "updatedAt">[];
}): Promise<Resume> {
  const result = await serverApi.patch<Resume>(BASE_URL, data);
  revalidateResume();
  return result;
}
