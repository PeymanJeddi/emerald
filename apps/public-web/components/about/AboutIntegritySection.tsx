import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { AboutContent } from "@/lib/about-api";

export function AboutIntegritySection({ data }: { data: AboutContent["integrity"] }) {
  return (
    <section className="border-b border-border bg-soft-white py-16 lg:py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader title={data.title} description={data.body} />
            {data.closing ? <p className="text-sm leading-relaxed text-graphite/75">{data.closing}</p> : null}
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {(data.bullets ?? []).map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-sm border border-emerald/15 bg-ivory px-4 py-3 text-sm text-graphite/85"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald/10 text-xs text-emerald">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
