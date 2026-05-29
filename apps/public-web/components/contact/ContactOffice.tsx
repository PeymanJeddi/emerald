import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ContactContent } from "@/lib/contact-api";

export function ContactOffice({ office }: { office: ContactContent["office"] }) {
  return (
    <section className="border-b border-border bg-soft-white py-16 lg:py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeader title={office.title} description={office.body} />
            <dl className="mt-8 space-y-4 text-sm">
              {office.office_name ? (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-widest text-graphite/55">Office</dt>
                  <dd className="mt-1 font-medium text-emerald">{office.office_name}</dd>
                </div>
              ) : null}
              {office.address ? (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-widest text-graphite/55">Address</dt>
                  <dd className="mt-1 text-graphite/80">{office.address}</dd>
                </div>
              ) : null}
              {(office.city || office.country) && (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-widest text-graphite/55">Location</dt>
                  <dd className="mt-1 text-graphite/80">
                    {[office.city, office.country, office.postal_code].filter(Boolean).join(", ")}
                  </dd>
                </div>
              )}
              {office.hours ? (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-widest text-graphite/55">Office hours</dt>
                  <dd className="mt-1 text-graphite/80">{office.hours}</dd>
                </div>
              ) : null}
              {office.maps_url ? (
                <div>
                  <a
                    href={office.maps_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-emerald-accent hover:underline"
                  >
                    View on map
                  </a>
                </div>
              ) : null}
            </dl>
          </div>
          <div
            className="flex min-h-[280px] items-center justify-center rounded-lg border border-emerald/15 bg-gradient-to-br from-emerald/10 via-ivory to-gold/10 p-8"
            aria-hidden
          >
            <p className="text-center font-serif text-2xl text-emerald/80">Global communication center</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
