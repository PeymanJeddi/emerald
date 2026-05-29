import type { CertificateStatus, ConferenceStatus } from "./types";

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function normalizeCertificateCode(code: string): string {
  return code.trim().toUpperCase();
}

export function formatVerificationTimestamp(date: Date = new Date()): string {
  return (
    date.toLocaleString("en-GB", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "UTC",
    }) + " UTC"
  );
}

export const SITE_NAME = "Emerald Scholars Congress";
export const SITE_SHORT = "Emerald Scholars";
export const SITE_EMAIL = "contact@emeraldscholarscongress.org";
export const SITE_DESCRIPTION =
  "Independent international platform for academic event records, scholarly participation, and certificate verification.";
