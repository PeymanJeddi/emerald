import { Container } from "@/components/ui/Container";
import type { ContactContent } from "@/lib/contact-api";

export function ContactPartnerships({ data }: { data: ContactContent["partnerships"] }) {
  return (
    <section className="border-b border-border bg-emerald-dark py-16 text-ivory lg:py-20">
      <Container className="max-w-3xl text-center">
        <h2 className="font-serif text-2xl sm:text-3xl">{data.title}</h2>
        <p className="mt-6 text-base leading-relaxed text-ivory/90">{data.body}</p>
        {data.cta_email ? (
          <a
            href={`mailto:${data.cta_email}`}
            className="mt-8 inline-block rounded-sm border border-gold/50 bg-ivory px-8 py-3 text-sm font-semibold text-emerald transition hover:bg-soft-white"
          >
            {data.cta_label ?? "Contact Partnerships Team"}
          </a>
        ) : null}
      </Container>
    </section>
  );
}
