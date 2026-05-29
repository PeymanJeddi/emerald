import type { Certificate } from "../types";

export const certificates: Certificate[] = [
  {
    code: "ESC-2026-AI-001",
    status: "Verified",
    holderName: "Daniel Morgan",
    eventTitle:
      "International Conference on Artificial Intelligence and Digital Systems 2026",
    eventSlug: "international-ai-digital-systems-2026",
    eventDate: "March 18–19, 2026",
    location: "Dubai, United Arab Emirates",
    format: "Hybrid",
    role: "Presenter",
    recordType: "Conference Participation Certificate",
    presentationTitle:
      "Human-Centered Applications of AI Assistants in Digital Workflows",
    issueDate: "March 20, 2026",
    eventReferenceCode: "ESC-EVT-2026-AI",
    verificationMessage:
      "This certificate record is valid and has been issued by Emerald Scholars Congress.",
  },
];

export function getCertificateByCode(code: string): Certificate | undefined {
  const normalized = code.trim().toUpperCase();
  return certificates.find((c) => c.code === normalized);
}
