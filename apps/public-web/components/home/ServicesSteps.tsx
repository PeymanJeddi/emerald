import { AcademicCard } from "@/components/ui/AcademicCard";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export type ServiceStep = {
  step: number;
  title: string;
  description: string;
};

interface ServicesStepsProps {
  sectionTitle: string;
  sectionSubtitle: string;
  steps: ServiceStep[];
}

export function ServicesSteps({ sectionTitle, sectionSubtitle, steps }: ServicesStepsProps) {
  return (
    <section className="border-t border-border bg-soft-white py-16 lg:py-20">
      <Container>
        <SectionHeader title={sectionTitle} description={sectionSubtitle} align="center" className="mx-auto" />
        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((item) => (
            <li key={item.step}>
              <AcademicCard
                as="article"
                className="relative h-full border-emerald/15 pt-10 transition-shadow hover:shadow-md"
              >
                <span
                  className="absolute -top-4 left-6 flex h-10 w-10 items-center justify-center rounded-sm border border-gold/40 bg-emerald font-serif text-lg text-ivory"
                  aria-hidden
                >
                  {item.step}
                </span>
                <h2 className="font-serif text-xl font-medium text-emerald">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-graphite/80">{item.description}</p>
              </AcademicCard>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
