import { ConferenceCard } from "@/components/conference/ConferenceCard";
import { AcademicCard } from "@/components/ui/AcademicCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EventHero } from "@/components/event/EventHero";
import { EventFAQSection } from "@/components/event/EventFAQ";
import { MarkdownContent } from "@/components/cms/MarkdownContent";
import { EventMarkdownSection } from "@/components/event/EventMarkdownSection";
import type { EventDetail } from "@/lib/event-detail-types";
import type { Conference } from "@/lib/types";
import { resolveMediaUrl } from "@/lib/media";
import { getVideoEmbedUrl } from "@/lib/video-embed";
import { EVENT_VERIFICATION_NOTE } from "@/lib/events-api";
import { PORTAL_REGISTER_URL } from "@/lib/portal-urls";

interface EventDetailViewProps {
  event: EventDetail;
  related: Conference[];
}

export function EventDetailView({ event, related }: EventDetailViewProps) {
  const c = event.content_json;
  const quick = c?.quick_info;
  const overviewMd = c?.overview_markdown || event.overview || "";

  return (
    <>
      <EventHero
        event={event}
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Events", href: "/events" },
          { label: event.title },
        ]}
      />

      {/* Quick information */}
      <section className="border-b border-border bg-soft-white py-10">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Event dates", value: event.dateLabel },
              { label: "Submission deadline", value: event.submission_deadline || "—" },
              { label: "Registration deadline", value: event.registration_deadline || "—" },
              { label: "Location", value: [event.location, event.country].filter(Boolean).join(", ") || "—" },
              { label: "Format", value: event.format || "—" },
              { label: "Organizer", value: quick?.organizer || "Emerald Scholars Congress" },
              { label: "Language", value: quick?.language || "English" },
              { label: "Reference code", value: event.event_code },
            ].map((item) => (
              <AcademicCard key={item.label} className="border-emerald/10 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-graphite/50">{item.label}</p>
                <p className="mt-2 text-sm font-medium text-emerald">{item.value}</p>
              </AcademicCard>
            ))}
          </div>
        </Container>
      </section>

      <EventMarkdownSection id="overview" title="Event Overview" markdown={overviewMd} />

      {/* Important dates */}
      {c?.important_dates && c.important_dates.length > 0 ? (
        <section className="border-t border-border py-12 lg:py-16">
          <Container>
            <h2 className="font-serif text-2xl text-emerald">Important Dates</h2>
            <ol className="mt-8 max-w-2xl space-y-4 border-l-2 border-gold/40 pl-6">
              {c.important_dates.map((d, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[1.65rem] top-1 flex h-3 w-3 rounded-full bg-emerald" aria-hidden />
                  <p className="font-medium text-emerald">{d.label}</p>
                  <p className="text-sm text-graphite/70">{d.date}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>
      ) : null}

      {/* Topics */}
      {c?.topics && c.topics.length > 0 ? (
        <section className="bg-ivory py-12 lg:py-16">
          <Container>
            <h2 className="font-serif text-2xl text-emerald">Topics & Categories</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {c.topics.map((t) => (
                <AcademicCard key={t.title} className="border-emerald/15 p-5">
                  <h3 className="font-medium text-emerald">{t.title}</h3>
                  {t.description ? <p className="mt-2 text-sm text-graphite/75">{t.description}</p> : null}
                </AcademicCard>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* People */}
      {c?.people_groups?.map((group) =>
        group.people?.length ? (
          <section key={group.group} className="border-t border-border py-12 lg:py-16">
            <Container>
              <h2 className="font-serif text-2xl text-emerald">{group.group}</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.people.map((p) => (
                  <AcademicCard key={p.full_name} className="border-emerald/15 p-5">
                    <p className="font-medium text-emerald">{p.full_name}</p>
                    <p className="mt-1 text-sm text-graphite/65">
                      {[p.position, p.institution, p.country].filter(Boolean).join(" · ")}
                    </p>
                    {p.bio ? <p className="mt-3 text-sm text-graphite/75 line-clamp-4">{p.bio}</p> : null}
                  </AcademicCard>
                ))}
              </div>
            </Container>
          </section>
        ) : null
      )}

      {/* Submission */}
      {c?.submission?.guidelines_markdown || c?.submission?.publication_markdown ? (
        <section className="bg-soft-white py-12 lg:py-16">
          <Container>
            <h2 className="font-serif text-2xl text-emerald">Submission & Publication</h2>
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              {c.submission.guidelines_markdown ? (
                <AcademicCard className="border-emerald/15 p-6">
                  <h3 className="font-medium text-emerald">Submission Guidelines</h3>
                  <div className="legal-markdown mt-4 text-sm">
                    <MarkdownContent content={c.submission.guidelines_markdown} />
                  </div>
                </AcademicCard>
              ) : null}
              {c.submission.publication_markdown ? (
                <AcademicCard className="border-emerald/15 p-6">
                  <h3 className="font-medium text-emerald">Publication Information</h3>
                  <p className="mt-4 whitespace-pre-wrap text-sm text-graphite/80">
                    {c.submission.publication_markdown}
                  </p>
                </AcademicCard>
              ) : null}
            </div>
            {c.submission.requirements?.length ? (
              <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-graphite/80">
                {c.submission.requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            ) : null}
          </Container>
        </section>
      ) : null}

      {/* Schedule */}
      {c?.schedule && c.schedule.length > 0 ? (
        <section className="py-12 lg:py-16">
          <Container>
            <h2 className="font-serif text-2xl text-emerald">Schedule / Agenda</h2>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[32rem] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-graphite/60">
                    <th className="py-2 pr-4">Day</th>
                    <th className="py-2 pr-4">Time</th>
                    <th className="py-2 pr-4">Session</th>
                    <th className="py-2">Speaker</th>
                  </tr>
                </thead>
                <tbody>
                  {c.schedule.map((row, i) => (
                    <tr key={i} className="border-b border-border/60">
                      <td className="py-3 pr-4 text-emerald">{row.day || "—"}</td>
                      <td className="py-3 pr-4">{row.time || "—"}</td>
                      <td className="py-3 pr-4">{row.session || "—"}</td>
                      <td className="py-3">{row.speaker || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </section>
      ) : null}

      {/* Registration CTA */}
      {c?.cta ? (
        <section className="bg-emerald py-14 text-ivory">
          <Container className="text-center">
            <h2 className="font-serif text-3xl">{c.cta.title ?? "Ready to Submit Your Work?"}</h2>
            <p className="mx-auto mt-4 max-w-xl text-ivory/90">{c.cta.subtitle}</p>
            <Button
              href={c.cta.primary_url ?? PORTAL_REGISTER_URL}
              variant="secondary"
              className="mt-8 min-w-[11rem] font-semibold"
            >
              {c.cta.primary_label ?? "Apply Now"}
            </Button>
          </Container>
        </section>
      ) : null}

      {/* Venue */}
      {c?.venue && (c.venue.venue_name || c.venue.address || c.venue.online_platform) ? (
        <section className="border-t border-border bg-ivory py-12">
          <Container>
            <h2 className="font-serif text-2xl text-emerald">Venue & Location</h2>
            <AcademicCard className="mt-6 max-w-2xl border-emerald/15 p-6">
              {c.venue.venue_name ? <p className="font-medium text-emerald">{c.venue.venue_name}</p> : null}
              {c.venue.address ? <p className="mt-2 text-sm text-graphite/80">{c.venue.address}</p> : null}
              {c.venue.online_platform ? (
                <p className="mt-2 text-sm text-graphite/80">Online: {c.venue.online_platform}</p>
              ) : null}
              {c.venue.maps_url ? (
                <a href={c.venue.maps_url} className="mt-4 inline-block text-sm text-emerald underline" target="_blank" rel="noreferrer">
                  View on map
                </a>
              ) : null}
            </AcademicCard>
          </Container>
        </section>
      ) : null}

      {/* Gallery */}
      {c?.gallery && c.gallery.length > 0 ? (
        <section className="py-12 lg:py-16">
          <Container>
            <h2 className="font-serif text-2xl text-emerald">Gallery</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {c.gallery.map((g, i) => {
                const src = resolveMediaUrl(g.url) || g.url;
                return (
                  <figure key={i} className="overflow-hidden rounded-sm border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={g.caption || ""} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                    {g.caption ? (
                      <figcaption className="px-3 py-2 text-xs text-graphite/65">{g.caption}</figcaption>
                    ) : null}
                  </figure>
                );
              })}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Videos */}
      {c?.videos && c.videos.length > 0 ? (
        <section className="bg-soft-white py-12 lg:py-16">
          <Container>
            <h2 className="font-serif text-2xl text-emerald">Videos & Recordings</h2>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {c.videos.map((v) => {
                const embed = getVideoEmbedUrl(v.url);
                const thumb = resolveMediaUrl(v.thumbnail_url);
                return (
                  <AcademicCard key={v.title} className="overflow-hidden border-emerald/15 p-0">
                    {embed ? (
                      <iframe src={embed} title={v.title} className="aspect-video w-full" allowFullScreen />
                    ) : thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt="" className="aspect-video w-full object-cover" />
                    ) : null}
                    <div className="p-4">
                      <h3 className="font-medium text-emerald">{v.title}</h3>
                      {v.speaker ? <p className="text-sm text-graphite/65">{v.speaker}</p> : null}
                    </div>
                  </AcademicCard>
                );
              })}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Publications */}
      {c?.publications && c.publications.length > 0 ? (
        <section className="py-12">
          <Container>
            <h2 className="font-serif text-2xl text-emerald">Proceedings & Publications</h2>
            <ul className="mt-8 space-y-4">
              {c.publications.map((p) => (
                <li key={p.title}>
                  <AcademicCard className="border-emerald/15 p-5">
                    <p className="font-medium text-emerald">{p.title}</p>
                    {p.authors ? <p className="text-sm text-graphite/65">{p.authors}</p> : null}
                    {p.journal ? <p className="text-sm text-graphite/65">{p.journal}</p> : null}
                    {p.doi ? <p className="mt-1 font-mono text-xs text-graphite/55">DOI: {p.doi}</p> : null}
                    {p.download_url ? (
                      <a href={p.download_url} className="mt-3 inline-block text-sm text-emerald underline">
                        Download
                      </a>
                    ) : null}
                  </AcademicCard>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* Sponsors */}
      {c?.sponsors && c.sponsors.length > 0 ? (
        <section className="border-t border-border bg-ivory py-12">
          <Container>
            <h2 className="font-serif text-2xl text-emerald">Sponsors & Partners</h2>
            <div className="mt-8 flex flex-wrap items-center gap-8">
              {c.sponsors.map((s) => (
                <div key={s.name} className="text-center">
                  {s.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={resolveMediaUrl(s.logo_url) || s.logo_url} alt={s.name} className="mx-auto h-12 object-contain" />
                  ) : (
                    <p className="text-sm font-medium text-emerald">{s.name}</p>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {c?.faq ? <EventFAQSection items={c.faq} /> : null}

      {/* Related */}
      {related.length > 0 ? (
        <section className="border-t border-border py-12 lg:py-16">
          <Container>
            <h2 className="font-serif text-2xl text-emerald">Related Events</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((conf) => (
                <ConferenceCard key={conf.slug} conference={conf} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="border-t border-border py-10">
        <Container>
          <AcademicCard className="bg-ivory">
            <p className="text-sm text-graphite/75">{EVENT_VERIFICATION_NOTE}</p>
          </AcademicCard>
        </Container>
      </section>

      {c?.footer_cta ? (
        <section className="bg-emerald-dark py-14 text-ivory">
          <Container className="text-center">
            <h2 className="font-serif text-2xl">{c.footer_cta.title ?? "Join Our Next Conference"}</h2>
            <Button
              href={c.footer_cta.primary_url ?? PORTAL_REGISTER_URL}
              variant="secondary"
              className="mt-8 min-w-[11rem]"
            >
              {c.footer_cta.primary_label ?? "Apply Now"}
            </Button>
          </Container>
        </section>
      ) : null}
    </>
  );
}
