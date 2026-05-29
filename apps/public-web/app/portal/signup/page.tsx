import { PORTAL_REGISTER_URL } from "@/lib/portal-urls";
import { redirect } from "next/navigation";

/** Applicant signup — user portal registration. */
export default function PortalSignupPage() {
  redirect(PORTAL_REGISTER_URL);
}
