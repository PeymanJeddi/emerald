import { apiFetch } from "@/lib/api";
import type { Certificate, CertificateStatus, EventFormat } from "@/lib/types";

export type ApiCertificatePublic = {
  certificate_code: string;
  holder_name: string;
  event_title_snapshot: string | null;
  event_date_snapshot: string | null;
  location_snapshot: string | null;
  event_slug: string | null;
  event_format: string | null;
  role: string | null;
  record_type: string | null;
  presentation_title: string | null;
  issue_date: string | null;
  status: string;
  verification_message: string | null;
};

function mapStatus(status: string): CertificateStatus {
  if (status === "verified") return "Verified";
  if (status === "revoked") return "Revoked";
  return "Pending";
}

function mapFormat(format: string | null | undefined): EventFormat {
  if (format === "Online" || format === "Hybrid" || format === "In-person") {
    return format;
  }
  return "Hybrid";
}

export function mapApiCertificate(api: ApiCertificatePublic): Certificate {
  return {
    code: api.certificate_code,
    status: mapStatus(api.status),
    holderName: api.holder_name,
    eventTitle: api.event_title_snapshot || "—",
    eventSlug: api.event_slug || "",
    eventDate: api.event_date_snapshot || "—",
    location: api.location_snapshot || "—",
    format: mapFormat(api.event_format),
    role: api.role || "—",
    recordType: api.record_type || "—",
    presentationTitle: api.presentation_title || "—",
    issueDate: api.issue_date || "—",
    eventReferenceCode: api.certificate_code,
    verificationMessage:
      api.verification_message ||
      "This certificate record has been verified by Emerald Scholars Congress.",
  };
}

function parseApiError(e: unknown): string {
  if (e instanceof Error) return e.message;
  return "Certificate not found";
}

export async function fetchCertificateByCode(
  code: string
): Promise<
  | { certificate: Certificate }
  | { error: string; revoked?: boolean; notIssued?: boolean }
> {
  try {
    const data = await apiFetch<ApiCertificatePublic>(
      `/api/public/certificates/verify/${encodeURIComponent(code)}`
    );
    return { certificate: mapApiCertificate(data) };
  } catch (e) {
    const message = parseApiError(e);
    const lower = message.toLowerCase();
    return {
      error: message,
      revoked: lower.includes("revoked"),
      notIssued: lower.includes("not been issued"),
    };
  }
}
