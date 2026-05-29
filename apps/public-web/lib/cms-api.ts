import { apiFetch } from "@/lib/api";

export type ServiceStepCard = {
  step?: number;
  title: string;
  description: string;
};

export type AdvantageCard = {
  title: string;
  description: string;
  icon_key?: string;
};

export type HomepageContent = {
  hero: Record<string, string>;
  features?: {
    section_title?: string;
    section_subtitle?: string;
    cards?: ServiceStepCard[];
  };
  services?: {
    section_title?: string;
    section_subtitle?: string;
    steps?: ServiceStepCard[];
  };
  advantages?: {
    section_title?: string;
    section_subtitle?: string;
    cards?: AdvantageCard[];
  };
  conferences?: {
    section_title?: string;
    section_subtitle?: string;
    past_section_title?: string;
    past_section_subtitle?: string;
  };
  testimonials?: {
    section_title?: string;
    section_subtitle?: string;
  };
  apply_cta?: {
    title?: string;
    subtitle?: string;
    primary_label?: string;
    primary_url?: string;
    secondary_label?: string;
    secondary_url?: string;
  };
  events?: {
    section_title?: string;
    section_subtitle?: string;
  };
  seo?: {
    title?: string;
    description?: string;
    og_image?: string;
  };
  institutional?: { title: string; body: string };
  verification?: { title: string; body: string; input_placeholder?: string };
};

export async function fetchHomepage(): Promise<HomepageContent | null> {
  try {
    return await apiFetch<HomepageContent>("/api/public/cms/homepage");
  } catch {
    return null;
  }
}

export async function fetchCmsPage(slug: string): Promise<Record<string, string> | null> {
  try {
    const page = await apiFetch<{ content_json: Record<string, string> | null }>(
      `/api/public/cms/page/${encodeURIComponent(slug)}`
    );
    return page.content_json;
  } catch {
    return null;
  }
}

export async function fetchNavigation(): Promise<Array<{ label: string; href: string }>> {
  try {
    const data = await apiFetch<{ items: Array<{ label: string; href: string }> }>(
      "/api/public/cms/navigation"
    );
    return data.items;
  } catch {
    return [];
  }
}

export async function fetchFooter(): Promise<Record<string, string>> {
  try {
    return await apiFetch<Record<string, string>>("/api/public/cms/footer");
  } catch {
    return {};
  }
}
