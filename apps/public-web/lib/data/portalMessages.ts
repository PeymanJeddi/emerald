import type { PortalMessage } from "@/lib/portal/types";

export const portalMessages: PortalMessage[] = [
  {
    id: "msg-001",
    title: "Submission Received",
    message:
      "Your submission has been received and is awaiting administrative screening.",
    date: "May 28, 2026",
    read: true,
  },
  {
    id: "msg-002",
    title: "Document Review Started",
    message:
      "Uploaded materials are currently being reviewed for completeness.",
    date: "June 1, 2026",
    read: false,
  },
  {
    id: "msg-003",
    title: "Certificate Record Available",
    message:
      "A public verification record has been generated for your certificate.",
    date: "March 20, 2026",
    read: true,
  },
];
