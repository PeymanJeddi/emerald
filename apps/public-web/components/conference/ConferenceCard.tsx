import Link from "next/link";
import { AcademicCard } from "@/components/ui/AcademicCard";
import { Badge, statusLabelToVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { resolveMediaUrl } from "@/lib/media";
import { isPastConference } from "@/lib/events-api";
import { PORTAL_REGISTER_URL } from "@/lib/portal-urls";
import type { Conference } from "@/lib/types";

interface ConferenceCardProps {
  conference: Conference;
  variant?: "upcoming" | "past";
}

export function ConferenceCard({ conference, variant = "upcoming" }: ConferenceCardProps) {
  const past = variant === "past" || isPastConference(conference.status);
  const cover = resolveMediaUrl(conference.coverImageUrl);

  return (
    <AcademicCard as="article" className="flex h-full flex-col overflow-hidden p-0">
      <div className="relative aspect-[16/9] w-full bg-emerald/10">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald/20 to-emerald-accent/20 font-serif text-2xl text-emerald/40">
            ESC
          </div>
        )}
        <Badge variant={statusLabelToVariant(conference.status)} className="absolute left-3 top-3">
          {conference.status}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-gold">{conference.category}</p>
        <h3 className="mt-2 font-serif text-lg leading-snug text-emerald">
          <Link href={`/conferences/${conference.slug}`} className="hover:underline">
            {conference.title}
          </Link>
        </h3>
        {conference.shortDescription ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-graphite/75">
            {conference.shortDescription}
          </p>
        ) : null}
        <dl className="mt-4 space-y-1 text-sm text-graphite/70">
          <div>
            <dt className="sr-only">Date</dt>
            <dd>{conference.date}</dd>
          </div>
          <div>
            <dt className="sr-only">Location</dt>
            <dd>
              {conference.location}
              {conference.country ? ` · ${conference.country}` : ""}
            </dd>
          </div>
          <div>
            <dt className="sr-only">Format</dt>
            <dd>{conference.format}</dd>
          </div>
          {conference.submissionDeadline && !past ? (
            <div>
              <dt className="sr-only">Submission deadline</dt>
              <dd>Deadline: {conference.submissionDeadline}</dd>
            </div>
          ) : null}
        </dl>
        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          {past ? (
            <>
              <Button href={`/conferences/${conference.slug}`} variant="secondary" className="flex-1 sm:flex-none">
                Conference Details
              </Button>
            </>
          ) : (
            <>
              <Button href={PORTAL_REGISTER_URL} className="flex-1 sm:flex-none">
                Apply Now
              </Button>
              <Button href={`/conferences/${conference.slug}`} variant="ghost" className="flex-1 sm:flex-none">
                View Details
              </Button>
            </>
          )}
        </div>
      </div>
    </AcademicCard>
  );
}
