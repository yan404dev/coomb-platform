import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import type { User } from "@/shared/entities";
import { getUserInitials, getUserAvatarUrl } from "@/shared/lib/user-utils";
import { cn } from "@/shared/lib/utils";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
  showRing?: boolean;
  className?: string;
}

export function UserAvatar({
  user,
  size = "md",
  showRing = false,
  className,
}: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-14 w-14 text-lg",
  };

  return (
    <Avatar
      className={cn(
        sizeClasses[size],
        showRing && "ring-2 ring-primary/10 shadow-md",
        className
      )}
    >
      <AvatarImage
        src={getUserAvatarUrl(user)}
        alt={user.fullName}
      />
      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-semibold">
        {getUserInitials(user.fullName)}
      </AvatarFallback>
    </Avatar>
  );
}
