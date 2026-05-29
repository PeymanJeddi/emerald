import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function AboutPartners({
  sectionTitle,
  sectionSubtitle,
  names,
}: {
  sectionTitle: string;
  sectionSubtitle?: string;
  names: string[];
}) {
  return (
    <section className="border-b border-border bg-soft-white py-16 lg:py-20">
      <Container>
        <SectionHeader title={sectionTitle} description={sectionSubtitle} align="center" className="mx-auto" />
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {names.map((name) => (
            <div
              key={name}
              className="flex min-h-[5rem] items-center justify-center rounded-sm border border-border bg-ivory px-3 py-4 text-center transition hover:border-emerald/30"
            >
              <span className="font-serif text-sm leading-snug text-graphite/70 grayscale">{name}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
