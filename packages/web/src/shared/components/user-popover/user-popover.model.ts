import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/shared/hooks/use-user";
import { authService } from "@/shared/services";
import { toast } from "sonner";

interface UseUserPopoverModelProps {
  onLogout?: () => void;
}

export function useUserPopoverModel({ onLogout }: UseUserPopoverModelProps) {
  const [open, setOpen] = useState(false);
  const { user, isLoading, mutate } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    try {
      authService.logout();
      mutate();
      onLogout?.();
      setOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  return {
    open,
    setOpen,
    user,
    isLoading,
    handleLogout,
  };
}
