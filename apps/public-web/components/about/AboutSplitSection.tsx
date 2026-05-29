import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface AboutSplitSectionProps {
  title: string;
  body: string;
  variant?: "light" | "muted";
  visualLabel?: string;
}

export function AboutSplitSection({
  title,
  body,
  variant = "light",
  visualLabel = "Academic collaboration",
}: AboutSplitSectionProps) {
  const bg = variant === "muted" ? "bg-soft-white" : "bg-ivory";

  return (
    <section className={`border-b border-border py-16 lg:py-20 ${bg}`}>
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader title={title} />
            <div className="prose prose-sm max-w-none text-graphite/85">
              {body.split("\n\n").map((para) => (
                <p key={para.slice(0, 40)} className="mb-4 leading-relaxed last:mb-0">
                  {para}
                </p>
              ))}
            </div>
          </div>
          <div
            className="relative flex aspect-[4/3] items-end overflow-hidden rounded-lg border border-emerald/15 bg-gradient-to-br from-emerald/20 via-ivory to-gold/20 p-8 shadow-sm"
            aria-hidden
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,61,54,0.08)_0%,transparent_50%)]" />
            <p className="relative font-serif text-2xl text-emerald">{visualLabel}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
