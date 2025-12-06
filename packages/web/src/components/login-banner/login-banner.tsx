import Link from "next/link";
import { Button } from "@/components/ui/button";

interface LoginBannerProps {
  onLoginClick?: () => void;
  compact?: boolean;
}

export function LoginBanner({
  onLoginClick,
  compact = false,
}: LoginBannerProps) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-3">
      <p className="text-sm text-gray-700 font-medium">
        Entre na sua conta para salvar as conversas
      </p>
      {!compact && (
        <p className="text-xs text-gray-600">
          Depois do login, você terá acesso às suas interações mais recentes
          aqui.
        </p>
      )}
      <Link href="/entrar" className="block" onClick={onLoginClick}>
        <Button
          className="w-full bg-primary hover:bg-primary/90"
          size="sm"
        >
          Fazer Login
        </Button>
      </Link>
    </div>
  );
}
