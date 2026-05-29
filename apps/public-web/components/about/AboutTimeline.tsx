import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { AboutTimelineItem } from "@/lib/about-api";

export function AboutTimeline({
  sectionTitle,
  items,
}: {
  sectionTitle: string;
  items: AboutTimelineItem[];
}) {
  return (
    <section className="border-b border-border bg-soft-white py-16 lg:py-20">
      <Container>
        <SectionHeader title={sectionTitle} align="center" className="mx-auto" />
        <ol className="relative mt-12 flex gap-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
          <div className="absolute left-0 right-0 top-8 hidden h-0.5 bg-gold/40 lg:block" aria-hidden />
          {items.map((item, index) => (
            <li key={item.year} className="relative min-w-[220px] flex-1 lg:min-w-0">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold bg-ivory font-serif text-lg text-emerald shadow-sm lg:mx-auto">
                {item.year}
              </div>
              <div className="archival-card rounded-sm border-emerald/15 p-5 lg:text-center">
                <p className="text-xs font-medium uppercase tracking-widest text-gold">Milestone {index + 1}</p>
                <h3 className="mt-2 font-serif text-lg text-emerald">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite/75">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
