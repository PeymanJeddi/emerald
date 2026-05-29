import { AUTH_SESSION_KEY } from "./constants";
import { portalUser } from "@/lib/data/portalUser";
import type { PortalUser } from "@/lib/portal/types";

export interface AuthSession {
  email: string;
  user: PortalUser;
  loggedInAt: string;
}

/**
 * TODO: Replace with real API authentication (e.g. NextAuth, custom JWT API).
 * This module simulates login for MVP development only.
 */

export function createMockSession(email: string): AuthSession {
  return {
    email: email.trim().toLowerCase(),
    user: { ...portalUser, email: email.trim().toLowerCase() },
    loggedInAt: new Date().toISOString(),
  };
}

export function saveSession(session: AuthSession): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function loadSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(AUTH_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(AUTH_SESSION_KEY);
}

/** Simulates login — accepts any non-empty email/password for demo. */
export function mockLogin(email: string, _password: string): AuthSession | null {
  if (!email.trim()) return null;
  const session = createMockSession(email);
  saveSession(session);
  return session;
}

/** Simulates registration — stores session after valid form submit. */
export function mockRegister(data: {
  email: string;
  fullName: string;
  affiliation: string;
  role: PortalUser["role"];
  country: string;
}): AuthSession {
  const session: AuthSession = {
    email: data.email.trim().toLowerCase(),
    user: {
      ...portalUser,
      fullName: data.fullName,
      displayName: data.fullName,
      email: data.email.trim().toLowerCase(),
      affiliation: data.affiliation,
      role: data.role,
      country: data.country,
    },
    loggedInAt: new Date().toISOString(),
  };
  saveSession(session);
  return session;
}

export function mockLogout(): void {
  clearSession();
}
