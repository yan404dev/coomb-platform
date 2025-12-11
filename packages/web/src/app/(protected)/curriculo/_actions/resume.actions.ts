"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type {
  Resume,
  Experience,
  Skill,
  Language,
  Education,
  Certification,
} from "@/shared/entities";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const BASE_URL = `${API_URL}/api/v1/resume`;

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Não autorizado");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Erro na requisição");
  }
  return response.json();
}

export async function addExperienceAction(
  data: Omit<Experience, "id" | "createdAt" | "updatedAt">
): Promise<Resume> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${BASE_URL}/experiences`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const result = await handleResponse<Resume>(response);
  revalidatePath("/curriculo");
  revalidatePath("/perfil");
  return result;
}

export async function updateExperienceAction(
  experienceId: string,
  data: Partial<Omit<Experience, "id">>
): Promise<Resume> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${BASE_URL}/experiences/${experienceId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });

  const result = await handleResponse<Resume>(response);
  revalidatePath("/curriculo");
  revalidatePath("/perfil");
  return result;
}

export async function deleteExperienceAction(
  experienceId: string
): Promise<Resume> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${BASE_URL}/experiences/${experienceId}`, {
    method: "DELETE",
    headers,
  });

  const result = await handleResponse<Resume>(response);
  revalidatePath("/curriculo");
  revalidatePath("/perfil");
  return result;
}

export async function addSkillAction(
  data: { name: string; level?: any }
): Promise<Resume> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${BASE_URL}/skills`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const result = await handleResponse<Resume>(response);
  revalidatePath("/curriculo");
  revalidatePath("/perfil");
  return result;
}

export async function updateSkillAction(
  skillId: string,
  data: Partial<Omit<Skill, "id">>
): Promise<Resume> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${BASE_URL}/skills/${skillId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });

  const result = await handleResponse<Resume>(response);
  revalidatePath("/curriculo");
  revalidatePath("/perfil");
  return result;
}

export async function deleteSkillAction(skillId: string): Promise<Resume> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${BASE_URL}/skills/${skillId}`, {
    method: "DELETE",
    headers,
  });

  const result = await handleResponse<Resume>(response);
  revalidatePath("/curriculo");
  revalidatePath("/perfil");
  return result;
}

export async function addLanguageAction(
  data: { name: string; level?: any }
): Promise<Resume> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${BASE_URL}/languages`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const result = await handleResponse<Resume>(response);
  revalidatePath("/curriculo");
  revalidatePath("/perfil");
  return result;
}

export async function updateLanguageAction(
  languageId: string,
  data: Partial<Omit<Language, "id">>
): Promise<Resume> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${BASE_URL}/languages/${languageId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });

  const result = await handleResponse<Resume>(response);
  revalidatePath("/curriculo");
  revalidatePath("/perfil");
  return result;
}

export async function deleteLanguageAction(
  languageId: string
): Promise<Resume> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${BASE_URL}/languages/${languageId}`, {
    method: "DELETE",
    headers,
  });

  const result = await handleResponse<Resume>(response);
  revalidatePath("/curriculo");
  revalidatePath("/perfil");
  return result;
}

export async function addEducationAction(
  data: Omit<Education, "id" | "createdAt" | "updatedAt">
): Promise<Resume> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${BASE_URL}/educations`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const result = await handleResponse<Resume>(response);
  revalidatePath("/curriculo");
  revalidatePath("/perfil");
  return result;
}

export async function updateEducationAction(
  educationId: string,
  data: Partial<Omit<Education, "id">>
): Promise<Resume> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${BASE_URL}/educations/${educationId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });

  const result = await handleResponse<Resume>(response);
  revalidatePath("/curriculo");
  revalidatePath("/perfil");
  return result;
}

export async function deleteEducationAction(
  educationId: string
): Promise<Resume> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${BASE_URL}/educations/${educationId}`, {
    method: "DELETE",
    headers,
  });

  const result = await handleResponse<Resume>(response);
  revalidatePath("/curriculo");
  revalidatePath("/perfil");
  return result;
}

export async function addCertificationAction(
  data: Omit<Certification, "id" | "createdAt" | "updatedAt">
): Promise<Resume> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${BASE_URL}/certifications`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const result = await handleResponse<Resume>(response);
  revalidatePath("/curriculo");
  revalidatePath("/perfil");
  return result;
}

export async function updateCertificationAction(
  certificationId: string,
  data: Partial<Omit<Certification, "id">>
): Promise<Resume> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${BASE_URL}/certifications/${certificationId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });

  const result = await handleResponse<Resume>(response);
  revalidatePath("/curriculo");
  revalidatePath("/perfil");
  return result;
}

export async function deleteCertificationAction(
  certificationId: string
): Promise<Resume> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${BASE_URL}/certifications/${certificationId}`, {
    method: "DELETE",
    headers,
  });

  const result = await handleResponse<Resume>(response);
  revalidatePath("/curriculo");
  revalidatePath("/perfil");
  return result;
}

export async function updateResumeAction(
  data: {
    experiences?: Omit<Experience, "id" | "createdAt" | "updatedAt">[];
    skills?: Omit<Skill, "id" | "createdAt" | "updatedAt">[];
    languages?: Omit<Language, "id" | "createdAt" | "updatedAt">[];
    educations?: Omit<Education, "id" | "createdAt" | "updatedAt">[];
    certifications?: Omit<Certification, "id" | "createdAt" | "updatedAt">[];
  }
): Promise<Resume> {
  const headers = await getAuthHeaders();

  const response = await fetch(BASE_URL, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });

  const result = await handleResponse<Resume>(response);
  revalidatePath("/curriculo");
  revalidatePath("/perfil");
  return result;
}
