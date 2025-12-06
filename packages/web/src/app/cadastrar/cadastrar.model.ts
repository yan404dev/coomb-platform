import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { mutate } from "swr";
import type { RegisterRequest } from "@/app/entrar/_schemas/auth.schema";
import { authService, sessionService } from "@/shared/services";

const SESSION_KEY = "coomb_session_id";

export function useRegisterModel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const transferAnonymousSession = async () => {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) return;

    await sessionService.transfer(sessionId).finally(() => {
      localStorage.removeItem(SESSION_KEY);
    });
  };

  const handleRegister = async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);

      localStorage.setItem("token", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));
      document.cookie = `token=${response.access_token}; path=/; max-age=86400`;

      await mutate("/api/v1/auth/me");
      await transferAnonymousSession();

      toast.success("Conta criada com sucesso! Bem-vindo ao Coomb!");

      const redirectTo = searchParams.get("redirectTo") || "/perfil";
      router.push(redirectTo);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Erro ao criar conta. Tente novamente.",
      );
    }
  };

  const handleOAuthLogin = (provider: "google" | "facebook" | "linkedin") => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    window.location.href = `${apiUrl}/api/v1/auth/${provider}`;
  };

  return {
    handleRegister,
    handleOAuthLogin,
  };
}
