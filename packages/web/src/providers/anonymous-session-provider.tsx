"use client";

import { useAnonymousSession } from "@/shared/hooks/use-anonymous-session";

export function AnonymousSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useAnonymousSession();

  return <>{children}</>;
}
