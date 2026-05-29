import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface AboutVisionSectionProps {
  title: string;
  body: string;
}

export function AboutVisionSection({ title, body }: AboutVisionSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-emerald-dark/30 bg-emerald-dark py-16 text-ivory lg:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 120%, rgba(184,155,94,0.2), transparent 55%)",
        }}
      />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              title={title}
              className="[&_h2]:text-ivory [&_.gold-divider]:border-gold/50"
            />
            <div className="space-y-4 text-base leading-relaxed text-ivory/90">
              {body.split("\n\n").map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </div>
          </div>
          <div className="relative flex aspect-square max-h-72 items-center justify-center rounded-full border border-gold/30 bg-emerald/30 lg:ml-auto lg:max-h-96">
            <div className="absolute h-3/4 w-3/4 rounded-full border border-ivory/20" />
            <div className="absolute h-1/2 w-1/2 rounded-full border border-gold/40" />
            <span className="relative px-6 text-center font-serif text-lg text-gold">Global academic network</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
