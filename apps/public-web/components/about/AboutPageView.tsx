import { ApplyNowSection } from "@/components/home/ApplyNowSection";
import { PlatformAdvantages } from "@/components/home/PlatformAdvantages";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";
import { AboutGallery } from "@/components/about/AboutGallery";
import { AboutGlobalSection } from "@/components/about/AboutGlobalSection";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutIntegritySection } from "@/components/about/AboutIntegritySection";
import { AboutPartners } from "@/components/about/AboutPartners";
import { AboutSplitSection } from "@/components/about/AboutSplitSection";
import { AboutStatsSection } from "@/components/about/AboutStatsSection";
import { AboutTimeline } from "@/components/about/AboutTimeline";
import { AboutValues } from "@/components/about/AboutValues";
import { AboutVisionSection } from "@/components/about/AboutVisionSection";
import { AboutWhySection } from "@/components/about/AboutWhySection";
import type { AboutContent } from "@/lib/about-api";
import type { Testimonial } from "@/lib/testimonials-api";

interface AboutPageViewProps {
  content: AboutContent;
  testimonials: Testimonial[];
}

export function AboutPageView({ content, testimonials }: AboutPageViewProps) {
  return (
    <>
      <AboutHero hero={content.hero} />
      <AboutSplitSection title={content.mission.title} body={content.mission.body} visualLabel="Mission & purpose" />
      <AboutVisionSection title={content.vision.title} body={content.vision.body} />
      <AboutWhySection data={content.why_built} />
      <PlatformAdvantages
        sectionTitle={content.advantages.section_title}
        sectionSubtitle={content.advantages.section_subtitle ?? ""}
        cards={content.advantages.cards ?? []}
      />
      <AboutIntegritySection data={content.integrity} />
      <AboutGlobalSection data={content.global_positioning} />
      <AboutStatsSection sectionTitle={content.statistics.section_title} items={content.statistics.items ?? []} />
      <AboutTimeline sectionTitle={content.timeline.section_title} items={content.timeline.items ?? []} />
      <AboutValues sectionTitle={content.values.section_title} cards={content.values.cards ?? []} />
      <AboutPartners
        sectionTitle={content.partners.section_title}
        sectionSubtitle={content.partners.section_subtitle}
        names={content.partners.names ?? []}
      />
      <TestimonialsCarousel
        title={content.testimonials.section_title}
        subtitle={content.testimonials.section_subtitle ?? ""}
        items={testimonials}
      />
      <AboutGallery sectionTitle={content.gallery.section_title} items={content.gallery.items ?? []} />
      <ApplyNowSection
        title={content.cta.title}
        subtitle={content.cta.subtitle}
        primaryLabel={content.cta.primary_label ?? "Explore Events"}
        primaryUrl={content.cta.primary_url ?? "/events"}
        secondaryLabel={content.cta.secondary_label}
        secondaryUrl={content.cta.secondary_url}
      />
    </>
  );
}
