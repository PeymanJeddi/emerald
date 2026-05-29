import type { UserSubmission } from "@/lib/portal/types";

export const userSubmissions: UserSubmission[] = [
  {
    id: "ESC-SUB-2026-001",
    title: "Human-Centered Applications of AI Assistants in Digital Workflows",
    eventSlug: "international-ai-digital-systems-2026",
    eventTitle:
      "International Conference on Artificial Intelligence and Digital Systems 2026",
    status: "Certificate Issued",
    submittedAt: "March 10, 2026",
    lastUpdated: "March 20, 2026",
    certificateCode: "ESC-2026-AI-001",
    participationType: "Presenter",
    attendanceFormat: "Hybrid",
    uploadedFiles: [
      "abstract-human-centered-ai.pdf",
      "presentation-slides-ai-workflows.pptx",
    ],
    certificateName: "Daniel Morgan",
    notes: [
      "Certificate record generated and linked to public verification.",
    ],
    requiredActions: [],
  },
  {
    id: "ESC-SUB-2026-014",
    title: "Governance Models for Digital Product Innovation",
    eventSlug: "european-innovation-management-technology-2026",
    eventTitle:
      "European Symposium on Innovation, Management and Technology 2026",
    status: "Document Review",
    submittedAt: "May 28, 2026",
    lastUpdated: "June 2, 2026",
    certificateCode: null,
    participationType: "Author",
    attendanceFormat: "In-person",
    uploadedFiles: ["abstract-governance-innovation.pdf"],
    certificateName: "Daniel Morgan",
    notes: ["Uploaded materials are currently being reviewed for completeness."],
    requiredActions: ["Await document review completion."],
  },
];

export function getSubmissionById(id: string): UserSubmission | undefined {
  return userSubmissions.find((s) => s.id === id);
}
