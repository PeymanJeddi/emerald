import Link from "next/link";
import type { ProfileCompletionState } from "@/lib/profile-types";

const PUBLIC_WEB = process.env.NEXT_PUBLIC_PUBLIC_WEB_URL || "http://localhost:3000";

interface Props {
  completion: ProfileCompletionState;
}

export function QuickActions({ completion }: Props) {
  const canApply = completion.can_submit_applications;

  const actions = [
    {
      title: "Complete Profile",
      description: "Finish required academic and identity information.",
      href: "/profile",
      show: !canApply,
    },
    {
      title: "Apply for Conference",
      description: "Browse events and submit an application.",
      href: canApply ? "/submissions/new" : "/profile",
      show: true,
      muted: !canApply,
    },
    {
      title: "Upload Documents",
      description: "Manage academic and identity documents.",
      href: "/documents",
      show: true,
    },
    {
      title: "View My Applications",
      description: "Track submitted requests and review statuses.",
      href: "/submissions",
      show: true,
    },
    {
      title: "Browse Events",
      description: "Explore upcoming conferences on the public site.",
      href: `${PUBLIC_WEB}/conferences`,
      external: true,
      show: true,
    },
    {
      title: "Contact Support",
      description: "Get help with submission, verification, or publication.",
      href: `${PUBLIC_WEB}/contact`,
      external: true,
      show: true,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {actions
        .filter((a) => a.show)
        .map((action) => {
          const className = `archival-card block rounded-sm p-5 transition hover:border-emerald ${
            action.muted ? "opacity-70" : ""
          }`;
          const inner = (
            <>
              <h3 className="font-serif text-lg text-emerald">{action.title}</h3>
              <p className="mt-1 text-sm text-graphite/65">{action.description}</p>
            </>
          );
          if (action.external) {
            return (
              <a key={action.title} href={action.href} target="_blank" rel="noopener noreferrer" className={className}>
                {inner}
              </a>
            );
          }
          return (
            <Link key={action.title} href={action.href} className={className}>
              {inner}
            </Link>
          );
        })}
    </div>
  );
}
