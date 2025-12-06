"use client";

import { useAnonymousSession } from "@/hooks";

export function AnonymousSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useAnonymousSession();

  return <>{children}</>;
}
