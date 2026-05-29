import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { AboutContent } from "@/lib/about-api";

export function AboutGlobalSection({ data }: { data: AboutContent["global_positioning"] }) {
  return (
    <section className="border-b border-border bg-ivory py-16 lg:py-20">
      <Container>
        <SectionHeader title={data.title} description={data.body} align="center" className="mx-auto" />
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {(data.bullets ?? []).map((item) => (
            <span
              key={item}
              className="rounded-full border border-emerald/20 bg-soft-white px-5 py-2 text-sm text-emerald shadow-sm"
            >
              {item}
            </span>
          ))}
        </div>
        <div
          className="mx-auto mt-12 max-w-4xl rounded-lg border border-emerald/15 bg-gradient-to-b from-emerald/5 to-transparent p-8 text-center"
          aria-hidden
        >
          <p className="font-serif text-3xl text-emerald/30">International participation</p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-gold">35+ countries · 70+ institutions</p>
        </div>
      </Container>
    </section>
  );
}
