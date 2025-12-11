"use client";

import { Logo, UserPopover } from "@/shared/components";
import { cn } from "@/shared/lib/utils";
import { NavigationLinks } from "./navigation-links";
import { usePathname } from "next/navigation";
import { useUser } from "@/shared/hooks/use-user";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

interface HeaderProps {
  nav?: boolean;
  className?: string;
}

export const Header = ({ nav = false, className }: HeaderProps) => {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const { user, isLoading } = useUser();

  return (
    <header
      className={cn(
        "h-[calc(.25rem*18)] sticky top-0 z-50 grid w-full grid-cols-[auto_1fr] gap-2 px-4 lg:px-8 bg-token-bg-primary lg:grid-cols-[1fr_auto_1fr] transition-colors duration-300 bg-background",
        className
      )}
    >
      <Logo variant="wordmark" size="md" />

      {nav && (
        <nav className="hidden items-center justify-center lg:flex">
          <ul className="flex items-center gap-2 lg:gap-4">
            <NavigationLinks
              isLandingPage={isLandingPage}
              className="cursor-pointer font-normal text-mkt-p2 flex items-center gap-0.5 rounded-lg px-2.5 whitespace-nowrap text-token-text-secondary hover:text-token-text-primary py-1.5 hover:bg-token-bg-secondary/50 transition-colors"
            />
          </ul>
        </nav>
      )}

      <div className="flex items-center justify-end gap-3">
        {!isLoading && (
          <>
            {user ? (
              <UserPopover />
            ) : (
              <Button asChild size="default">
                <Link href="/dashboard">Experimentar a Coomb</Link>
              </Button>
            )}
          </>
        )}
      </div>
    </header>
  );
};
