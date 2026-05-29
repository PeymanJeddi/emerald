"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  type AuthSession,
  loadSession,
  mockLogout,
} from "@/lib/auth/mockAuth";
import type { PortalUser } from "@/lib/portal/types";

interface AuthContextValue {
  session: AuthSession | null;
  user: PortalUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setSession: (session: AuthSession | null) => void;
  logout: () => void;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(() => loadSession());
  const [isLoading] = useState(false);

  const refreshSession = useCallback(() => {
    setSessionState(loadSession());
  }, []);

  const setSession = useCallback((next: AuthSession | null) => {
    setSessionState(next);
  }, []);

  const logout = useCallback(() => {
    mockLogout();
    setSessionState(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
      isAuthenticated: !!session,
      setSession,
      logout,
      refreshSession,
    }),
    [session, isLoading, setSession, logout, refreshSession]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
