import type { ApplicantProfile } from "@/lib/profile-types";

/** Full name of the logged-in applicant for certificates and primary author display. */
export function getPresentingAuthorName(profile: ApplicantProfile | null | undefined): string {
  if (!profile) return "";

  if (profile.full_name?.trim()) {
    return profile.full_name.trim();
  }

  if (profile.display_name?.trim()) {
    return profile.display_name.trim();
  }

  const personal = profile.profile?.personal as Record<string, string> | undefined;
  const parts = [
    personal?.first_name || profile.first_name,
    personal?.middle_name || profile.middle_name,
    personal?.last_name || profile.last_name,
  ]
    .map((p) => (typeof p === "string" ? p.trim() : ""))
    .filter(Boolean);

  return parts.join(" ");
}
