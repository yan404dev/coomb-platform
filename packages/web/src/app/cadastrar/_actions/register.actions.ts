"use server";

import type { RegisterRequest } from "../_schemas/auth.schema";
import { serverApi, authCookie } from "@/shared/lib/server-api";

interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    full_name: string;
  };
}

interface ActionResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

export async function registerAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const data: RegisterRequest = {
    full_name: formData.get("full_name") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || undefined,
    password: formData.get("password") as string,
  };

  try {
    const response = await serverApi.post<AuthResponse>("/api/v1/auth/register", data);
    await authCookie.set(response.access_token);

    return {
      success: true,
      redirectTo: "/perfil",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao criar conta",
    };
  }
}
