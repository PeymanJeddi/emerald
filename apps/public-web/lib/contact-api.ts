import { apiFetch } from "@/lib/api";

export type ContactMethodCard = {
  title: string;
  description: string;
  email: string;
  availability?: string;
  response?: string;
  phone?: string;
};

export type ContactDepartment = { name: string; description: string };
export type ContactFAQItem = { question: string; answer: string };
export type SocialLink = { platform: string; url: string; label: string };

export type ContactContent = {
  hero: {
    label?: string;
    title: string;
    subtitle: string;
    primary_cta_label?: string;
    primary_cta_url?: string;
    secondary_cta_label?: string;
    secondary_cta_url?: string;
  };
  introduction: { title: string; body: string };
  contact_methods: { section_title: string; cards: ContactMethodCard[] };
  form: {
    title: string;
    subtitle?: string;
    support_note?: string;
    privacy_url?: string;
  };
  departments: { section_title: string; items: ContactDepartment[] };
  office: {
    title: string;
    body: string;
    office_name?: string;
    address?: string;
    city?: string;
    country?: string;
    postal_code?: string;
    maps_url?: string;
    hours?: string;
  };
  faq: { section_title: string; items: ContactFAQItem[] };
  partnerships: {
    title: string;
    body: string;
    cta_label?: string;
    cta_email?: string;
  };
  social: { section_title: string; links: SocialLink[] };
  priority_notice: { title: string; body: string };
  cta: {
    title: string;
    subtitle: string;
    primary_label?: string;
    primary_url?: string;
    secondary_label?: string;
    secondary_url?: string;
  };
  seo: { title?: string; description?: string; og_image?: string | null };
};

export const INQUIRY_TYPES = [
  "General Inquiry",
  "Conference Support",
  "Submission Assistance",
  "Publication Support",
  "Verification Inquiry",
  "Technical Support",
  "Partnership Request",
  "Sponsorship Inquiry",
  "Media Inquiry",
] as const;

export async function fetchContact(): Promise<ContactContent | null> {
  try {
    return await apiFetch<ContactContent>("/api/public/cms/contact");
  } catch {
    return null;
  }
}

export async function submitContactInquiry(payload: {
  full_name: string;
  email: string;
  institution?: string;
  country?: string;
  inquiry_type: string;
  subject: string;
  message: string;
  consent: boolean;
}): Promise<{ id: string; message: string }> {
  return apiFetch("/api/public/contact/inquiries", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
