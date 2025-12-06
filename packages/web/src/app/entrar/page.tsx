"use client";

import { Suspense } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Header } from "@/components";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type LoginRequest, loginSchema } from "@/app/entrar/_schemas/auth.schema";
import { useLoginModel } from "./entrar.model";

const LoginPage = () => {
  const { handleLogin, handleOAuthLogin } = useLoginModel();

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    await handleLogin(data);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header nav />

      <div className="flex flex-1 items-center justify-between px-4 md:px-24">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md px-4 md:px-0">
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
                  <span className="px-3 bg-background text-foreground/60">
                    ou
                  </span>
                </div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
                >
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
                    disabled={form.formState.isSubmitting}
                    className="w-full h-10 bg-[#028A5A] hover:bg-[#02754d] text-white text-sm font-semibold"
                  >
                    {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </Form>

              <div className="text-center">
                <a
                  href="/cadastrar"
                  className="text-xs text-[#028A5A] font-semibold hover:underline cursor-pointer"
                >
                  Não tem uma conta? Cadastre-se
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex w-[40%] items-center justify-center">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto rounded-2xl"
          >
            <source src="/login-coomb.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Carregando...
        </div>
      }
    >
      <LoginPage />
    </Suspense>
  );
}
