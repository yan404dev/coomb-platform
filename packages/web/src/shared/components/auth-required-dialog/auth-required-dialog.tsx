"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

interface AuthRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthRequiredDialog({
  open,
  onOpenChange,
}: AuthRequiredDialogProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogin = () => {
    onOpenChange(false);
    router.push(`/entrar?redirectTo=${encodeURIComponent(pathname)}&transfer=true`);
  };

  const handleSignup = () => {
    onOpenChange(false);
    router.push(`/cadastrar?redirectTo=${encodeURIComponent(pathname)}&transfer=true`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Faça login para continuar
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            Para baixar seu currículo, você precisa estar logado. Não se
            preocupe, sua conversa será mantida!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <Button
            onClick={handleSignup}
            className="w-full h-11 bg-[#028A5A] hover:bg-[#02754d] text-white font-semibold"
          >
            Criar conta grátis
          </Button>

          <button
            onClick={handleLogin}
            className="w-full text-sm text-[#028A5A] font-semibold hover:underline py-2 cursor-pointer"
          >
            Já tem uma conta? Entre
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
