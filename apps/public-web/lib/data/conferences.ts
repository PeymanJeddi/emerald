import type { Conference } from "../types";

export const conferences: Conference[] = [
  {
    title:
      "International Conference on Artificial Intelligence and Digital Systems 2026",
    slug: "international-ai-digital-systems-2026",
    date: "March 18–19, 2026",
    location: "Dubai, United Arab Emirates",
    format: "Hybrid",
    status: "Completed",
    category: "Artificial Intelligence and Digital Systems",
    eventReferenceCode: "ESC-EVT-2026-AI",
    overview:
      "A formal academic event focused on artificial intelligence, digital systems, applied technology, and interdisciplinary research exchange.",
  },
  {
    title:
      "European Symposium on Innovation, Management and Technology 2026",
    slug: "european-innovation-management-technology-2026",
    date: "June 12–13, 2026",
    location: "Vienna, Austria",
    format: "In-person",
    status: "Upcoming",
    category: "Innovation, Management and Technology",
    eventReferenceCode: "ESC-EVT-2026-EMS",
    overview:
      "An academic symposium focused on innovation, management studies, digital transformation, and technology-oriented organizational research.",
  },
  {
    title:
      "Global Forum on Engineering, Design and Applied Sciences 2026",
    slug: "engineering-design-applied-sciences-2026",
    date: "September 4–5, 2026",
    location: "Online",
    format: "Online",
    status: "Open for Registration",
    category: "Engineering, Design and Applied Sciences",
    eventReferenceCode: "ESC-EVT-2026-ENG",
    overview:
      "A multidisciplinary academic forum covering applied engineering, design methods, research practice, and scientific communication.",
  },
];

export function getConferenceBySlug(slug: string): Conference | undefined {
  return conferences.find((c) => c.slug === slug);
}

export function getConferencesByStatus(
  status: Conference["status"] | "All"
): Conference[] {
  if (status === "All") return conferences;
  return conferences.filter((c) => c.status === status);
}

export const EVENT_VERIFICATION_NOTE =
  "Participation and certificate records related to this event can be validated only through the official certificate verification system using a valid certificate code.";
