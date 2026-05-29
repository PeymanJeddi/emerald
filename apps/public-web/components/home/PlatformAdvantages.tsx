import { AcademicCard } from "@/components/ui/AcademicCard";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { AdvantageCard } from "@/lib/cms-api";

const DEFAULT_CARDS: AdvantageCard[] = [
  {
    title: "Academic Verification",
    description: "All submissions go through structured verification and integrity review processes.",
  },
  {
    title: "International Publication Opportunities",
    description: "Eligible submissions may qualify for official publication and academic exposure.",
  },
  {
    title: "Professional Review Process",
    description: "Our academic teams review and guide submissions through the evaluation workflow.",
  },
  {
    title: "Secure Applicant Portal",
    description:
      "Applicants can securely manage submissions, revisions, and conference participation through their portal.",
  },
];

interface PlatformAdvantagesProps {
  sectionTitle: string;
  sectionSubtitle: string;
  cards: AdvantageCard[];
}

export function PlatformAdvantages({ sectionTitle, sectionSubtitle, cards }: PlatformAdvantagesProps) {
  const items = cards.length > 0 ? cards : DEFAULT_CARDS;

  return (
    <section className="border-b border-border bg-ivory py-16 lg:py-20">
      <Container>
        <SectionHeader title={sectionTitle} description={sectionSubtitle} align="center" className="mx-auto" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((card) => (
            <AcademicCard key={card.title} as="article" className="h-full border-emerald/15">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-sm bg-emerald/10 font-serif text-lg text-emerald">
                ✦
              </div>
              <h2 className="font-serif text-lg font-medium text-emerald">{card.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-graphite/80">{card.description}</p>
            </AcademicCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
