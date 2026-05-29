import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

interface ApplyNowSectionProps {
  title: string;
  subtitle: string;
  primaryLabel: string;
  primaryUrl: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
}

export function ApplyNowSection({
  title,
  subtitle,
  primaryLabel,
  primaryUrl,
  secondaryLabel,
  secondaryUrl,
}: ApplyNowSectionProps) {
  return (
    <section className="bg-emerald py-16 text-ivory lg:py-20">
      <Container className="text-center">
        <h2 className="font-serif text-3xl font-medium sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ivory/90">{subtitle}</p>
        <div className="gold-divider mx-auto mt-8 max-w-xs" aria-hidden />
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href={primaryUrl} variant="secondary" className="min-w-[11rem] px-8 py-3 text-base font-semibold">
            {primaryLabel}
          </Button>
          {secondaryLabel && secondaryUrl ? (
            <Button href={secondaryUrl} variant="ghost" className="border-ivory/40 text-ivory hover:bg-ivory/10">
              {secondaryLabel}
            </Button>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
