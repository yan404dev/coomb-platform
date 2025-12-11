"use server";

import type { LoginRequest } from "../_schemas/auth.schema";
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

export async function loginAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const data: LoginRequest = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  try {
    const response = await serverApi.post<AuthResponse>("/api/v1/auth/login", data);
    await authCookie.set(response.access_token);

    return {
      success: true,
      redirectTo: "/perfil",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Credenciais inválidas",
    };
  }
}
