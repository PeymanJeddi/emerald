import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { AboutContent } from "@/lib/about-api";
import { PORTAL_REGISTER_URL } from "@/lib/portal-urls";

export function AboutHero({ hero }: { hero: AboutContent["hero"] }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-emerald-dark via-emerald to-emerald-accent text-ivory">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(184,155,94,0.25), transparent 40%), radial-gradient(circle at 80% 60%, rgba(247,244,238,0.12), transparent 45%)",
        }}
        aria-hidden
      />
      <Container className="relative py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            {hero.label ? (
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold">{hero.label}</p>
            ) : null}
            <h1 className="mt-4 font-serif text-3xl font-medium leading-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              {hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/90 lg:text-lg">{hero.subtitle}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href={hero.primary_cta_url ?? "/events"} variant="secondary" className="min-w-[11rem] font-semibold">
                {hero.primary_cta_label ?? "Explore Events"}
              </Button>
              <Button
                href={hero.secondary_cta_url ?? PORTAL_REGISTER_URL}
                variant="ghost"
                className="border-ivory/40 text-ivory hover:bg-ivory/10"
              >
                {hero.secondary_cta_label ?? "Apply Now"}
              </Button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {[
                "Keynote & research forums",
                "International delegates",
                "Publication pathways",
                "Academic networking",
              ].map((label, i) => (
                <div
                  key={label}
                  className={`archival-card flex aspect-[4/3] flex-col justify-end rounded-sm border-ivory/20 bg-ivory/10 p-4 backdrop-blur-sm ${i % 2 === 1 ? "translate-y-6" : ""}`}
                >
                  <span className="text-xs uppercase tracking-widest text-gold/90">ESC</span>
                  <p className="mt-2 font-serif text-lg text-ivory">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
