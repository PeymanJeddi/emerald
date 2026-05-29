import Link from "next/link";

const PUBLIC_WEB = process.env.NEXT_PUBLIC_PUBLIC_WEB_URL || "http://localhost:3000";

export function ApplyNowCard() {
  return (
    <section
      className="relative overflow-hidden rounded-sm border border-emerald-accent bg-emerald px-6 py-8 text-ivory shadow-sm sm:px-8 sm:py-10"
      aria-labelledby="apply-now-heading"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gold/15 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-6 h-32 w-32 rounded-full bg-emerald-accent/60 blur-2xl"
        aria-hidden
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/15 px-3 py-1 text-xs font-medium uppercase tracking-widest text-gold">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] text-emerald">
              ✓
            </span>
            Profile complete
          </p>
          <h2 id="apply-now-heading" className="mt-4 font-serif text-3xl text-ivory sm:text-4xl">
            Ready to apply
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ivory/85 sm:text-base">
            Your applicant profile is complete. Start a new conference application or browse
            upcoming events.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <Link
            href="/submissions/new"
            className="inline-flex items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-center text-sm font-semibold tracking-wide text-emerald transition hover:bg-ivory hover:text-emerald"
          >
            Apply Now
          </Link>
          <Link
            href={`${PUBLIC_WEB}/conferences`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-sm border border-ivory/40 px-6 py-3 text-center text-sm text-ivory transition hover:border-ivory hover:bg-ivory/10"
          >
            Browse conferences
          </Link>
        </div>
      </div>
    </section>
  );
}
