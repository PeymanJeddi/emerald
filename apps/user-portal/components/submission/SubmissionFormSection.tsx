import { cn } from "@/lib/utils";
import type { SectionStatus } from "@/lib/submissions/types";

const STATUS_LABELS: Record<SectionStatus, string> = {
  completed: "Completed",
  incomplete: "Incomplete",
  locked: "Locked",
};

interface Props {
  sectionNumber: number;
  title: string;
  subtitle: string;
  status: SectionStatus;
  children: React.ReactNode;
  notice?: string;
}

export function SubmissionFormSection({
  sectionNumber,
  title,
  subtitle,
  status,
  children,
  notice,
}: Props) {
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-widest text-graphite/45">
            Section {sectionNumber}
          </p>
          <h2 className="mt-1 font-serif text-2xl text-emerald">{title}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-graphite/65">{subtitle}</p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide",
            status === "completed" && "bg-emerald/10 text-emerald",
            status === "incomplete" && "bg-gold/15 text-graphite",
            status === "locked" && "bg-border/60 text-graphite/50"
          )}
        >
          {STATUS_LABELS[status]}
        </span>
      </div>

      {notice && <p className="text-sm text-graphite/55">{notice}</p>}
      <div className="space-y-4">{children}</div>
    </section>
  );
}
