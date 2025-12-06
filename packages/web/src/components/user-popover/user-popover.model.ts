import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { authService } from "@/services";
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
      mutate(undefined, false);
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
