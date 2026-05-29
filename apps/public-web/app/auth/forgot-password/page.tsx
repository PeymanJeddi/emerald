import { PORTAL_FORGOT_PASSWORD_URL } from "@/lib/portal-urls";
import { redirect } from "next/navigation";

export default function AuthForgotPasswordRedirectPage() {
  redirect(PORTAL_FORGOT_PASSWORD_URL);
}
