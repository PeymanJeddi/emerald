import { ApplyNowSection } from "@/components/home/ApplyNowSection";
import { EventsExplorerSection } from "@/components/home/EventsExplorerSection";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { HomeStructuredData } from "@/components/home/HomeStructuredData";
import { PlatformAdvantages } from "@/components/home/PlatformAdvantages";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";
import { UpcomingConferencesSection } from "@/components/home/UpcomingConferencesSection";
import { fetchHomepage } from "@/lib/cms-api";
import { PORTAL_REGISTER_URL } from "@/lib/portal-urls";
import { fetchHeroSlides } from "@/lib/hero-api";
import { fetchTestimonials } from "@/lib/testimonials-api";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await fetchHomepage();
  const seo = homepage?.seo;
  return {
    title: seo?.title ?? "Emerald Scholars Congress | International Academic Conferences",
    description:
      seo?.description ??
      "Join international academic conferences, submit your research, and access verified publication pathways.",
    openGraph: { title: seo?.title, description: seo?.description },
    twitter: { card: "summary_large_image", title: seo?.title, description: seo?.description },
  };
}

export default async function HomePage() {
  const [homepage, slides, testimonials] = await Promise.all([
    fetchHomepage(),
    fetchHeroSlides(),
    fetchTestimonials(),
  ]);

  const advantages = homepage?.advantages;
  const conferences = homepage?.conferences;
  const testimonialsMeta = homepage?.testimonials;
  const applyCta = homepage?.apply_cta;
  const eventsMeta = homepage?.events;

  return (
    <>
      <HomeStructuredData />
      <HeroCarousel
        slides={slides}
        fallback={{
          title: homepage?.hero?.title ?? "Join Our International Academic Conference",
          subtitle:
            homepage?.hero?.subtitle ??
            "Submit your academic work and complete the verification process through our official platform.",
          description:
            "Create your applicant account, submit your academic materials, and become eligible for conference participation and publication.",
        }}
      />
      <PlatformAdvantages
        sectionTitle={advantages?.section_title ?? "Why Join Our Conference Platform"}
        sectionSubtitle={
          advantages?.section_subtitle ??
          "A professional academic platform designed for verification, publication, and international conference participation."
        }
        cards={advantages?.cards ?? []}
      />
      <UpcomingConferencesSection
        title={conferences?.section_title ?? "Upcoming Conferences"}
        subtitle={
          conferences?.section_subtitle ??
          "The nearest upcoming conferences currently open or approaching registration and submission deadlines."
        }
      />
      <TestimonialsCarousel
        title={testimonialsMeta?.section_title ?? "What Participants Say"}
        subtitle={
          testimonialsMeta?.section_subtitle ??
          "Feedback from researchers, participants, reviewers, and academic contributors."
        }
        items={testimonials}
      />
      <ApplyNowSection
        title={applyCta?.title ?? "Ready to Join Our Conference?"}
        subtitle={
          applyCta?.subtitle ??
          "Create your applicant account, submit your academic materials, and begin your conference journey today."
        }
        primaryLabel={applyCta?.primary_label ?? "Apply Now"}
        primaryUrl={applyCta?.primary_url ?? PORTAL_REGISTER_URL}
        secondaryLabel={applyCta?.secondary_label ?? "Explore Events"}
        secondaryUrl={applyCta?.secondary_url ?? "/events"}
      />
      <EventsExplorerSection
        title={eventsMeta?.section_title ?? "Events"}
        subtitle={
          eventsMeta?.section_subtitle ??
          "Browse upcoming and past conferences, academic events, and publication opportunities."
        }
      />
    </>
  );
}
