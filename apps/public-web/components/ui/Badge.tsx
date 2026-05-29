import { cn } from "@/lib/utils";

type BadgeVariant =
  | "verified"
  | "upcoming"
  | "completed"
  | "open"
  | "draft"
  | "pending"
  | "gold"
  | "emerald"
  | "screening"
  | "review"
  | "rejected";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  verified: "bg-emerald/10 text-emerald border-emerald/30",
  emerald: "bg-emerald text-ivory border-emerald",
  upcoming: "bg-emerald-accent/15 text-emerald-accent border-emerald-accent/30",
  completed: "bg-graphite/10 text-graphite border-border",
  open: "bg-gold/15 text-emerald-dark border-gold/40",
  draft: "bg-gray-100 text-gray-600 border-border",
  pending: "bg-emerald/10 text-emerald border-emerald/25",
  gold: "bg-gold/20 text-emerald-dark border-gold",
  screening: "bg-emerald-dark text-ivory border-emerald-dark",
  review: "bg-gold/15 text-emerald-dark border-gold/50",
  rejected: "bg-stone-200 text-stone-700 border-stone-300",
};

export function Badge({
  children,
  variant = "draft",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-medium border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function statusLabelToVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    Verified: "verified",
    Completed: "completed",
    Upcoming: "upcoming",
    "Open for Registration": "open",
    Pending: "pending",
    Revoked: "draft",
    Draft: "draft",
    Submitted: "emerald",
    "Administrative Screening": "screening",
    "Document Review": "review",
    "Academic Review": "upcoming",
    "Revision Requested": "gold",
    Accepted: "emerald",
    "Certificate Issued": "gold",
    Archived: "completed",
    Closed: "completed",
    "Submission Open": "open",
    "Under Review": "review",
    "Registration Open": "open",
    Ongoing: "upcoming",
    Rejected: "rejected",
  };
  return map[status] ?? "draft";
}
