import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function ContactIntro({ title, body }: { title: string; body: string }) {
  return (
    <section className="border-b border-border bg-soft-white py-16 lg:py-20">
      <Container>
        <SectionHeader title={title} align="center" className="mx-auto" />
        <div className="mx-auto mt-6 max-w-3xl space-y-4 text-center text-base leading-relaxed text-graphite/80">
          {body.split("\n\n").map((para) => (
            <p key={para.slice(0, 48)}>{para}</p>
          ))}
        </div>
      </Container>
    </section>
  );
}
