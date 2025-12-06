import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { mutate } from "swr";
import type { LoginRequest } from "@/schemas/auth.schema";
import { authService, sessionService } from "@/services";

const SESSION_KEY = "coomb_session_id";

export function useLoginModel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const transferAnonymousSession = async () => {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) return;

    await sessionService.transfer(sessionId).finally(() => {
      localStorage.removeItem(SESSION_KEY);
    });
  };

  const handleLogin = async (data: LoginRequest) => {
    try {
      const response = await authService.login(data);

      localStorage.setItem("token", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));
      document.cookie = `token=${response.access_token}; path=/; max-age=86400`;

      await mutate("/api/v1/auth/me");
      await transferAnonymousSession();

      toast.success("Login realizado com sucesso!");

      const redirectTo = searchParams.get("redirectTo") || "/perfil";
      router.push(redirectTo);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Erro ao fazer login. Verifique suas credenciais.",
      );
    }
  };

  const handleOAuthLogin = (provider: "google" | "facebook" | "linkedin") => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    window.location.href = `${apiUrl}/api/v1/auth/${provider}`;
  };

  return {
    handleLogin,
    handleOAuthLogin,
  };
}
