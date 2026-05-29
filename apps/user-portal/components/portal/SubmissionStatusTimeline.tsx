import { TIMELINE_STATUSES, type SubmissionStatus } from "@/lib/portal/types";
import { cn } from "@/lib/utils";

interface SubmissionStatusTimelineProps {
  currentStatus: SubmissionStatus;
}

function stepIndex(status: SubmissionStatus): number {
  if (status === "Rejected" || status === "Revision Requested") {
    const academicIdx = TIMELINE_STATUSES.indexOf("Academic Review");
    return academicIdx >= 0 ? academicIdx : 0;
  }
  if (status === "Archived") {
    return TIMELINE_STATUSES.length - 1;
  }
  const idx = TIMELINE_STATUSES.indexOf(status);
  return idx >= 0 ? idx : 0;
}

export function SubmissionStatusTimeline({
  currentStatus,
}: SubmissionStatusTimelineProps) {
  const currentIdx = stepIndex(currentStatus);

  return (
    <ol className="space-y-0">
      {TIMELINE_STATUSES.map((step, index) => {
        const done = index < currentIdx;
        const current = index === currentIdx;
        return (
          <li key={step} className="relative flex gap-4 pb-8 last:pb-0">
            {index < TIMELINE_STATUSES.length - 1 && (
              <span
                className={cn(
                  "absolute left-[11px] top-6 h-full w-px",
                  done ? "bg-emerald" : "bg-border"
                )}
                aria-hidden
              />
            )}
            <span
              className={cn(
                "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs",
                current
                  ? "border-gold bg-emerald text-ivory"
                  : done
                    ? "border-emerald bg-emerald text-ivory"
                    : "border-border bg-soft-white text-gray-400"
              )}
            >
              {done && !current ? "✓" : index + 1}
            </span>
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  current || done ? "text-emerald" : "text-gray-500"
                )}
              >
                {step}
              </p>
              {current && (
                <p className="mt-0.5 text-xs text-gold">Current status</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
