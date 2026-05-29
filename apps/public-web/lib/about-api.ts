import { apiFetch } from "@/lib/api";
import type { AdvantageCard } from "@/lib/cms-api";

export type AboutStat = { value: number; suffix?: string; label: string };
export type AboutTimelineItem = { year: string; title: string; description: string };
export type AboutValueCard = { title: string; description: string };
export type AboutGalleryItem = { caption: string; tone?: string; image_url?: string };

export type AboutContent = {
  hero: {
    label?: string;
    title: string;
    subtitle: string;
    primary_cta_label?: string;
    primary_cta_url?: string;
    secondary_cta_label?: string;
    secondary_cta_url?: string;
  };
  mission: { title: string; body: string };
  vision: { title: string; body: string };
  why_built: { title: string; body: string; bullets?: string[]; closing?: string };
  advantages: { section_title: string; section_subtitle?: string; cards: AdvantageCard[] };
  integrity: { title: string; body: string; bullets?: string[]; closing?: string };
  global_positioning: { title: string; body: string; bullets?: string[] };
  statistics: { section_title: string; items: AboutStat[] };
  timeline: { section_title: string; items: AboutTimelineItem[] };
  values: { section_title: string; cards: AboutValueCard[] };
  partners: { section_title: string; section_subtitle?: string; names: string[] };
  gallery: { section_title: string; items: AboutGalleryItem[] };
  testimonials: { section_title: string; section_subtitle?: string };
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

export async function fetchAbout(): Promise<AboutContent | null> {
  try {
    return await apiFetch<AboutContent>("/api/public/cms/about");
  } catch {
    return null;
  }
}
