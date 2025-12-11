"use server";

import { cookies } from "next/headers";
import { loginSchema } from "../_schemas/auth.schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validation = loginSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Dados inválidos",
    };
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validation.data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Credenciais inválidas",
      };
    }

    const data: AuthResponse = await response.json();

    const cookieStore = await cookies();
    cookieStore.set("token", data.access_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return {
      success: true,
      redirectTo: "/perfil",
    };
  } catch {
    return {
      success: false,
      error: "Erro ao conectar com o servidor",
    };
  }
}
