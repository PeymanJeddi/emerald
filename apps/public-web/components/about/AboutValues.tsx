import { AcademicCard } from "@/components/ui/AcademicCard";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { AboutValueCard } from "@/lib/about-api";

export function AboutValues({ sectionTitle, cards }: { sectionTitle: string; cards: AboutValueCard[] }) {
  return (
    <section className="border-b border-border bg-ivory py-16 lg:py-20">
      <Container>
        <SectionHeader title={sectionTitle} align="center" className="mx-auto" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {cards.map((card) => (
            <AcademicCard key={card.title} className="h-full border-emerald/15 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald/10 font-serif text-xl text-emerald">
                ◆
              </div>
              <h3 className="font-serif text-lg text-emerald">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-graphite/80">{card.description}</p>
            </AcademicCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
