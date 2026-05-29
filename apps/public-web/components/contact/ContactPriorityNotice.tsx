import { Container } from "@/components/ui/Container";

export function ContactPriorityNotice({ title, body }: { title: string; body: string }) {
  return (
    <section className="border-b border-border bg-ivory py-10">
      <Container>
        <div className="rounded-sm border border-gold/40 bg-gold/5 px-6 py-5 sm:px-8">
          <h2 className="font-serif text-lg text-emerald">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-graphite/80">{body}</p>
        </div>
      </Container>
    </section>
  );
}
