import { PORTAL_LOGIN_URL } from "@/lib/portal-urls";
import { redirect } from "next/navigation";

/** Portal sign-in lives on the user portal app. */
export default function AuthLoginRedirectPage() {
  redirect(PORTAL_LOGIN_URL);
}
