import { PORTAL_REGISTER_URL } from "@/lib/portal-urls";
import { redirect } from "next/navigation";

export default function AuthRegisterRedirectPage() {
  redirect(PORTAL_REGISTER_URL);
}
