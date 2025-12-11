"use client";

import { useActionState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { registerSchema, type RegisterRequest } from "../_schemas/auth.schema";
import { registerAction } from "../_actions/register.actions";

const SESSION_KEY = "coomb_session_id";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(registerAction, null);

  const form = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  useEffect(() => {
    if (state?.success) {
      toast.success("Conta criada com sucesso! Bem-vindo ao Coomb!");

      const sessionId = localStorage.getItem(SESSION_KEY);
      if (sessionId) {
        localStorage.removeItem(SESSION_KEY);
      }

      const redirectTo = searchParams.get("redirectTo") || state.redirectTo || "/perfil";
      router.push(redirectTo);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router, searchParams]);

  const handleOAuthLogin = (provider: "google" | "facebook" | "linkedin") => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    window.location.href = `${apiUrl}/api/v1/auth/${provider}`;
  };

  return (
    <div className="md:border md:border-border md:rounded-xl md:p-6 space-y-4 md:shadow-[var(--shadow-header)]">
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => handleOAuthLogin("google")}
          className="flex items-center justify-center h-10 border border-border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <span className="text-lg font-semibold">G</span>
        </button>
        <button
          type="button"
          onClick={() => handleOAuthLogin("facebook")}
          className="flex items-center justify-center h-10 border border-border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <span className="text-lg font-semibold">f</span>
        </button>
        <button
          type="button"
          onClick={() => handleOAuthLogin("linkedin")}
          className="flex items-center justify-center h-10 border border-border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <span className="text-lg font-semibold">in</span>
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-background text-foreground/60">ou</span>
        </div>
      </div>

      <Form {...form}>
        <form action={formAction} className="space-y-3">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-foreground">
                  Nome completo
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Seu nome"
                    {...field}
                    className="h-10 text-sm border-border focus:border-2 focus:border-[#028A5A]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-foreground">
                  E-mail
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    {...field}
                    className="h-10 text-sm border-border focus:border-2 focus:border-[#028A5A]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-foreground">
                  Telefone
                </FormLabel>
                <FormControl>
                  <IMaskInput
                    mask="(00) 00000-0000"
                    placeholder="(00) 00000-0000"
                    value={field.value}
                    onAccept={(value) => field.onChange(value)}
                    className="w-full h-10 px-3 text-sm border border-border rounded-lg bg-transparent outline-none focus:border-2 focus:border-[#028A5A] transition-all"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-foreground">
                  Senha
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    className="h-10 text-sm border-border focus:border-2 focus:border-[#028A5A]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-10 bg-[#028A5A] hover:bg-[#02754d] text-white text-sm font-semibold"
          >
            {isPending ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <a
          href="/entrar"
          className="text-xs text-[#028A5A] font-semibold hover:underline cursor-pointer"
        >
          Já tem uma conta? Entre
        </a>
      </div>
    </div>
  );
}
