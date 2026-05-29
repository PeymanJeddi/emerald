import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { SocialLink } from "@/lib/contact-api";

export function ContactSocial({ sectionTitle, links }: { sectionTitle: string; links: SocialLink[] }) {
  return (
    <section className="border-b border-border bg-soft-white py-12 lg:py-16">
      <Container>
        <SectionHeader title={sectionTitle} align="center" className="mx-auto" />
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {links.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-sm border border-border bg-ivory px-6 py-3 text-sm font-medium text-graphite/70 transition hover:border-emerald hover:text-emerald"
            >
              {link.label}
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
