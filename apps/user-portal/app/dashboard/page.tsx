"use client";

import { useEffect, useState } from "react";
import { getDashboard } from "@/lib/profile-api";
import type { DashboardData } from "@/lib/profile-types";
import { ApplyNowCard } from "@/components/dashboard/ApplyNowCard";
import { ProfileCompletionCard } from "@/components/dashboard/ProfileCompletionCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ApplicationsWidget } from "@/components/dashboard/ApplicationsWidget";
import { DocumentStatusWidget } from "@/components/dashboard/DocumentStatusWidget";
import { MessagesWidget } from "@/components/dashboard/MessagesWidget";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load dashboard"));
  }, []);

  if (error) {
    return <p className="text-sm text-red-700">{error}</p>;
  }

  if (!data) {
    return <p className="text-sm text-graphite/60">Loading your dashboard…</p>;
  }

  const { user } = data;
  const firstName = user.first_name || user.full_name.split(" ")[0] || "Applicant";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <h1 className="font-serif text-3xl text-emerald">Welcome back, {firstName}</h1>
        <p className="mt-2 max-w-2xl text-sm text-graphite/70">
          Manage your academic profile, conference applications, submissions, and verification status
          from your applicant portal.
        </p>
      </header>

      {user.completion.can_submit_applications ? (
        <ApplyNowCard />
      ) : (
        <ProfileCompletionCard completion={user.completion} />
      )}

      <section>
        <h2 className="mb-4 font-serif text-xl text-emerald">Quick Actions</h2>
        <QuickActions completion={user.completion} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <ApplicationsWidget
          submissions={data.recent_submissions}
          canApply={user.completion.can_submit_applications}
        />
        <DocumentStatusWidget status={data.document_status} />
      </div>

      <MessagesWidget unreadCount={data.unread_messages_count} />
    </div>
  );
}
