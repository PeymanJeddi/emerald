import { Badge, statusLabelToVariant } from "@/components/ui/Badge";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { EventDetail } from "@/lib/event-detail-types";
import { PORTAL_REGISTER_URL } from "@/lib/portal-urls";
import { resolveMediaUrl } from "@/lib/media";
import { getVideoEmbedUrl, isDirectVideoUrl } from "@/lib/video-embed";

interface EventHeroProps {
  event: EventDetail;
  breadcrumbItems: BreadcrumbItem[];
}

export function EventHero({ event, breadcrumbItems }: EventHeroProps) {
  const hero = event.content_json?.hero;
  const poster =
    resolveMediaUrl(event.video_thumbnail_url) ||
    resolveMediaUrl(event.hero_image_url) ||
    resolveMediaUrl(event.cover_image_url);
  const embed = event.hero_video_url ? getVideoEmbedUrl(event.hero_video_url) : null;
  const directVideo = event.hero_video_url && isDirectVideoUrl(event.hero_video_url);
  const overlayOpacity = hero?.overlay_opacity ?? 0.5;

  const primaryLabel = hero?.primary_label ?? (event.status === "Completed" ? "View Archive" : "Apply Now");
  const primaryUrl = hero?.primary_url ?? PORTAL_REGISTER_URL;

  const subtitle = event.subtitle || event.short_description;

  return (
    <section className="border-b border-border bg-soft-white pb-8 pt-3 sm:pb-10 sm:pt-4">
      <Container className="space-y-4">
        <Breadcrumb items={breadcrumbItems} compact />

        <div className="relative w-full overflow-hidden rounded-lg border border-border shadow-sm">
          <div className="relative aspect-[16/9] w-full bg-emerald-dark sm:aspect-[2.1/1] lg:aspect-[2.75/1]">
            {embed ? (
              <iframe
                src={embed}
                title={event.title}
                className="absolute inset-0 h-full w-full pointer-events-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : directVideo && event.hero_video_url ? (
              <video
                className="absolute inset-0 h-full w-full object-cover"
                poster={poster}
                muted
                playsInline
                src={event.hero_video_url}
              />
            ) : poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-dark via-emerald to-emerald-accent" />
            )}

            <div
              className="absolute inset-0 bg-gradient-to-t from-emerald-dark via-emerald-dark/70 to-emerald-dark/20"
              style={{ opacity: Math.min(1, overlayOpacity + 0.25) }}
              aria-hidden
            />

            <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 sm:p-7 lg:p-9">
              <div className="flex flex-wrap gap-2">
                <Badge variant={statusLabelToVariant(event.status)}>{event.status}</Badge>
                {event.event_type ? (
                  <span className="rounded-sm border border-ivory/30 bg-emerald-dark/40 px-2.5 py-0.5 text-xs text-ivory/95 backdrop-blur-sm">
                    {event.event_type}
                  </span>
                ) : null}
                {event.category ? (
                  <span className="rounded-sm border border-gold/50 bg-emerald-dark/40 px-2.5 py-0.5 text-xs text-gold backdrop-blur-sm">
                    {event.category}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-3 font-serif text-2xl font-medium leading-tight text-ivory sm:mt-4 sm:text-3xl lg:text-4xl">
                {event.title}
              </h1>

              {subtitle ? (
                <p className="mt-2 max-w-3xl text-sm text-ivory/90 sm:mt-3 sm:text-base lg:text-lg">
                  {subtitle}
                </p>
              ) : null}

              <div className="mt-5 sm:mt-6">
                <Button href={primaryUrl} variant="secondary" className="min-w-[10rem] font-semibold">
                  {primaryLabel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
