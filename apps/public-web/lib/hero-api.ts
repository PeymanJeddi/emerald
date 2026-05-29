import { apiFetch } from "@/lib/api";

export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  background_image_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  cta_type: string;
  display_priority: number;
};

export async function fetchHeroSlides(): Promise<HeroSlide[]> {
  try {
    return await apiFetch<HeroSlide[]>("/api/public/cms/hero-slides");
  } catch {
    return [];
  }
}
