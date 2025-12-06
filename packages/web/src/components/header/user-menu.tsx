import Link from "next/link";
import { UserCircle, LogOut } from "lucide-react";
import type { User } from "@/shared/types";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

interface UserMenuProps {
  user: User;
  onLogout: () => void;
  variant?: "desktop" | "mobile";
}

export const UserMenu = ({
  user,
  onLogout,
  variant = "desktop",
}: UserMenuProps) => {
  return (
    <div className="flex flex-col gap-1">
      {variant === "mobile" && (
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.avatar_url || "https://github.com/ghost.png"}
              alt={user.full_name}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.full_name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.full_name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
      )}

      {variant === "desktop" && (
        <div className="px-3 py-2 border-b">
          <p className="text-sm font-medium">{user.full_name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      )}

      <Link
        href="/perfil"
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
      >
        <UserCircle className="h-4 w-4" />
        Meu Perfil
      </Link>
      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent text-destructive transition-colors text-left"
      >
        <LogOut className="h-4 w-4" />
        Sair
      </button>
    </div>
  );
};
