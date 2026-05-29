import { apiFetch } from "@/lib/api";

export type Testimonial = {
  id: string;
  full_name: string;
  position_title: string | null;
  institution: string | null;
  country: string | null;
  profile_image_url: string | null;
  testimonial_text: string;
  rating: number | null;
  display_priority: number;
};

export async function fetchTestimonials(): Promise<Testimonial[]> {
  try {
    return await apiFetch<Testimonial[]>("/api/public/cms/testimonials");
  } catch {
    return [];
  }
}
