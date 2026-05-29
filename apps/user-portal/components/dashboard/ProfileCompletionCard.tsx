import Link from "next/link";
import type { ProfileCompletionState } from "@/lib/profile-types";

const SECTION_LABELS: Record<string, string> = {
  personal: "Personal Information",
  contact: "Contact Information",
  academic: "Academic Information",
  affiliation: "Affiliation Information",
  researcher: "Researcher Profile",
  identity: "Identity Verification",
  consents: "Consent & Terms",
};

interface Props {
  completion: ProfileCompletionState;
}

export function ProfileCompletionCard({ completion }: Props) {
  const missingLabels = completion.missing_fields.map((m) => m.label);
  const incomplete = !completion.can_submit_applications;

  return (
    <div className="archival-card rounded-sm p-5">
      {incomplete && (
        <p className="mb-4 rounded-sm border border-gold/40 bg-gold/10 px-4 py-2.5 text-sm text-graphite/80">
          Complete your applicant profile to submit conference applications, upload documents, and
          participate in academic programs.
        </p>
      )}

      <div className="flex items-end justify-between gap-4">
        <p className="text-sm text-graphite/70">
          {incomplete
            ? "Finish the remaining sections to unlock applications."
            : "Your profile is complete and ready for applications."}
        </p>
        <p className="shrink-0 font-serif text-2xl text-emerald">{completion.percent}%</p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
        <div
          className="h-full bg-emerald transition-all"
          style={{ width: `${completion.percent}%` }}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:gap-6">
        <div>
          <h3 className="text-xs font-medium uppercase tracking-widest text-graphite/50">
            Profile Completion
          </h3>
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
            {Object.entries(SECTION_LABELS).map(([key, label]) => {
              const section = completion.sections[key];
              const done = section?.complete;
              return (
                <li key={key} className="flex items-center gap-2 text-sm">
                  <span
                    className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${
                      done ? "bg-emerald text-ivory" : "border border-border text-graphite/50"
                    }`}
                  >
                    {done ? "✓" : ""}
                  </span>
                  <span className={done ? "text-graphite" : "text-graphite/60"}>{label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {missingLabels.length > 0 && (
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-graphite/50">
              Missing
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-graphite/80">
              {missingLabels.slice(0, 8).map((label) => (
                <li key={label} className="flex gap-2">
                  <span className="text-graphite/40">·</span>
                  <span>{label}</span>
                </li>
              ))}
              {missingLabels.length > 8 && (
                <li className="text-graphite/60">+{missingLabels.length - 8} more</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {incomplete && (
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/profile"
            className="rounded-sm bg-emerald px-4 py-2 text-sm font-medium text-ivory hover:bg-emerald-accent"
          >
            Complete Profile
          </Link>
          <Link
            href="/profile#required"
            className="rounded-sm border border-border bg-soft-white px-4 py-2 text-sm text-emerald hover:border-emerald"
          >
            View Required Information
          </Link>
        </div>
      )}
    </div>
  );
}
