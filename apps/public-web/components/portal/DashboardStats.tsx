import { AcademicCard } from "@/components/ui/AcademicCard";
import type { UserSubmission } from "@/lib/portal/types";

interface DashboardStatsProps {
  submissions: UserSubmission[];
}

export function DashboardStats({ submissions }: DashboardStatsProps) {
  const active = submissions.filter(
    (s) => !["Archived", "Rejected", "Certificate Issued"].includes(s.status)
  ).length;
  const underReview = submissions.filter((s) =>
    ["Administrative Screening", "Document Review", "Academic Review"].includes(
      s.status
    )
  ).length;
  const verified = submissions.filter((s) => s.status === "Certificate Issued").length;
  const pending = submissions.filter(
    (s) => s.status === "Revision Requested" || s.status === "Draft"
  ).length;

  const stats = [
    { label: "Active Submissions", value: active },
    { label: "Under Review", value: underReview },
    { label: "Verified Records", value: verified },
    { label: "Pending Actions", value: pending },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <AcademicCard key={stat.label}>
          <p className="text-xs font-medium uppercase tracking-widest text-gray-500">
            {stat.label}
          </p>
          <p className="mt-2 font-serif text-3xl text-navy">{stat.value}</p>
        </AcademicCard>
      ))}
    </div>
  );
}
