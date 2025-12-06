import { useEffect, useCallback } from "react";
import useSWR from "swr";
import { sessionService } from "@/shared/services/session.service";
import { useUser } from "@/shared/hooks/use-user";

const SESSION_KEY = "coomb_session_id";

const getStoredSessionId = () => localStorage.getItem(SESSION_KEY);
const setStoredSessionId = (id: string) => localStorage.setItem(SESSION_KEY, id);
const clearStoredSessionId = () => localStorage.removeItem(SESSION_KEY);

async function fetchOrCreateSession(user: any): Promise<string | null> {
  if (user) return null;

  const stored = getStoredSessionId();

  if (stored) {
    try {
      const session = await sessionService.get(stored);
      if (new Date(session.expiresAt) > new Date()) {
        return stored;
      }
    } catch {
      clearStoredSessionId();
    }
  }

  const newSession = await sessionService.createAnonymous();
  setStoredSessionId(newSession.sessionId);
  return newSession.sessionId;
}

export function useAnonymousSession() {
  const { user } = useUser();

  const { data: sessionId, mutate } = useSWR(
    user ? null : "anonymous-session",
    () => fetchOrCreateSession(user),
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  useEffect(() => {
    if (!user) return;

    const stored = getStoredSessionId();
    if (stored) {
      sessionService
        .transfer(stored)
        .then(() => clearStoredSessionId())
        .catch(() => clearStoredSessionId());
    }
  }, [user]);

  const clearSession = useCallback(() => {
    clearStoredSessionId();
    mutate(null);
  }, [mutate]);

  return {
    sessionId: sessionId ?? null,
    isAnonymous: !user && !!sessionId,
    clearSession,
  };
}
