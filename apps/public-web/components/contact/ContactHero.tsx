import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { ContactContent } from "@/lib/contact-api";

export function ContactHero({ hero }: { hero: ContactContent["hero"] }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-emerald-dark via-emerald to-emerald-accent text-ivory">
      <Container className="relative py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            {hero.label ? (
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold">{hero.label}</p>
            ) : null}
            <h1 className="mt-4 font-serif text-3xl font-medium leading-tight sm:text-4xl lg:text-[2.75rem]">
              {hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/90 lg:text-lg">{hero.subtitle}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href={hero.primary_cta_url ?? "#contact-form"} variant="secondary" className="min-w-[11rem] font-semibold">
                {hero.primary_cta_label ?? "Contact Support"}
              </Button>
              <Button
                href={hero.secondary_cta_url ?? "/events"}
                variant="ghost"
                className="border-ivory/40 text-ivory hover:bg-ivory/10"
              >
                {hero.secondary_cta_label ?? "Explore Events"}
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="archival-card rounded-lg border-ivory/20 bg-ivory/10 p-8 backdrop-blur-sm">
              <p className="font-serif text-2xl text-ivory">Professional academic support</p>
              <ul className="mt-6 space-y-3 text-sm text-ivory/85">
                <li>Conference & submission guidance</li>
                <li>Publication workflow assistance</li>
                <li>Verification & integrity support</li>
                <li>Institutional partnerships</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
