"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserPopover, Logo } from "@/components";
import { useUser } from "@/hooks/use-user";

export const DashboardHeader = () => {
  const { user, isLoading } = useUser();

  return (
    <header className="sticky top-0 z-40 bg-background w-full border-b border-border">
      <div className="flex items-center justify-between gap-2 px-4 sm:px-6 py-3 h-14">
        <div className="hidden sm:block">
          <Logo variant="wordmark" size="md" href="/dashboard" />
        </div>
        <div className="sm:hidden" />
        <nav className="flex items-center gap-1">
          <Link href="/" className="hidden md:block">
            <Button variant="ghost" size="sm">
              Sobre a Coomb
            </Button>
          </Link>
          {!user && (
            <Link href="/" className="hidden md:block">
              <Button variant="ghost" size="sm">
                Assinaturas
              </Button>
            </Link>
          )}

          {!isLoading && user && (
            <>
              <Link href="/curriculo" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  Currículo
                </Button>
              </Link>
              <Link href="/assinatura" className="hidden md:block">
                <Button variant="secondary" size="sm" className="font-medium">
                  Faça upgrade para o Coomb AI Plus
                </Button>
              </Link>
              <UserPopover />
            </>
          )}

          {!isLoading && !user && (
            <Link
              href="/entrar"
              className={buttonVariants({
                variant: "default",
                size: "sm",
              })}
            >
              Fazer Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
