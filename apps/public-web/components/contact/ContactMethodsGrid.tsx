import { AcademicCard } from "@/components/ui/AcademicCard";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ContactMethodCard } from "@/lib/contact-api";

export function ContactMethodsGrid({
  sectionTitle,
  cards,
}: {
  sectionTitle: string;
  cards: ContactMethodCard[];
}) {
  return (
    <section className="border-b border-border bg-ivory py-16 lg:py-20">
      <Container>
        <SectionHeader title={sectionTitle} align="center" className="mx-auto" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <AcademicCard
              key={card.title}
              as="article"
              className="flex h-full flex-col border-emerald/15 transition hover:border-emerald/30 hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-sm bg-emerald/10 font-serif text-lg text-emerald">
                ✉
              </div>
              <h2 className="font-serif text-lg text-emerald">{card.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-graphite/80">{card.description}</p>
              <div className="mt-5 space-y-1 border-t border-border/60 pt-4 text-xs text-graphite/65">
                <p>
                  <a href={`mailto:${card.email}`} className="font-medium text-emerald-accent hover:underline">
                    {card.email}
                  </a>
                </p>
                {card.availability ? <p>Hours: {card.availability}</p> : null}
                {card.response ? <p>Response: {card.response}</p> : null}
              </div>
            </AcademicCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
