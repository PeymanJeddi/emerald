import { AcademicCard } from "@/components/ui/AcademicCard";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { AboutContent } from "@/lib/about-api";

export function AboutWhySection({ data }: { data: AboutContent["why_built"] }) {
  return (
    <section className="border-b border-border bg-ivory py-16 lg:py-20">
      <Container>
        <SectionHeader title={data.title} description={data.body} align="center" className="mx-auto" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(data.bullets ?? []).map((item) => (
            <AcademicCard key={item} className="border-emerald/15">
              <div className="mb-3 text-gold">✦</div>
              <p className="text-sm font-medium text-emerald">{item}</p>
            </AcademicCard>
          ))}
        </div>
        {data.closing ? (
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-graphite/75">{data.closing}</p>
        ) : null}
      </Container>
    </section>
  );
}
