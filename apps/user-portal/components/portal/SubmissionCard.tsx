import Link from "next/link";
import { Badge, statusLabelToVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AcademicCard } from "@/components/ui/AcademicCard";
import type { UserSubmission } from "@/lib/portal/types";

interface SubmissionCardProps {
  submission: UserSubmission;
  compact?: boolean;
}

export function SubmissionCard({ submission, compact }: SubmissionCardProps) {
  return (
    <AcademicCard className={compact ? "p-4" : undefined}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-mono text-xs text-gray-500">{submission.id}</p>
        <Badge variant={statusLabelToVariant(submission.status)}>
          {submission.status}
        </Badge>
      </div>
      <h3 className="mt-2 font-medium text-navy">{submission.title}</h3>
      <p className="mt-1 text-sm text-gray-600">{submission.eventTitle}</p>
      <p className="mt-2 text-xs text-gray-500">
        Last updated {submission.lastUpdated}
      </p>
      {!compact && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button href={`/portal/submissions/${submission.id}`} variant="secondary">
            View Details
          </Button>
          {submission.status === "Draft" && (
            <Button href="/portal/submissions/new" variant="ghost">
              Continue Draft
            </Button>
          )}
        </div>
      )}
    </AcademicCard>
  );
}
