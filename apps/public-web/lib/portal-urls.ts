/** User portal base URL (separate app in dev: :3001). */
export const USER_PORTAL_URL =
  process.env.NEXT_PUBLIC_USER_PORTAL_URL ?? "http://localhost:3001";

export const PORTAL_LOGIN_URL = `${USER_PORTAL_URL}/login`;
export const PORTAL_REGISTER_URL = `${USER_PORTAL_URL}/register`;
export const PORTAL_FORGOT_PASSWORD_URL = `${USER_PORTAL_URL}/forgot-password`;
