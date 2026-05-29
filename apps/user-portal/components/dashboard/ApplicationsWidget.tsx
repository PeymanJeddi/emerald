import Link from "next/link";
import type { DashboardData } from "@/lib/profile-types";

interface Props {
  submissions: DashboardData["recent_submissions"];
  canApply: boolean;
}

export function ApplicationsWidget({ submissions, canApply }: Props) {
  return (
    <div className="archival-card rounded-sm p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-serif text-xl text-emerald">My Applications</h2>
        <Link href="/submissions" className="text-xs text-emerald hover:underline">
          View all
        </Link>
      </div>

      {submissions.length === 0 ? (
        <div className="mt-6 text-sm text-graphite/70">
          <p>You have not submitted any applications yet.</p>
          <p className="mt-2">
            {canApply
              ? "Start your first conference application when you are ready."
              : "Complete your profile to start your first conference application."}
          </p>
          <Link
            href={canApply ? "/submissions/new" : "/profile"}
            className="mt-4 inline-block text-sm font-medium text-emerald hover:underline"
          >
            {canApply ? "New application" : "Complete profile"}
          </Link>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {submissions.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <p className="text-sm font-medium text-graphite">{s.title}</p>
                <p className="text-xs text-graphite/50">{s.submission_code}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-sm border border-border px-2 py-0.5 text-xs text-graphite/70">
                  {s.status}
                </span>
                <Link href={`/submissions/${s.id}`} className="text-xs text-emerald hover:underline">
                  View
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
