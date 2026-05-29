"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ApplicationSubmissionForm } from "@/components/submission/ApplicationSubmissionForm";
import { getProfile } from "@/lib/profile-api";
import type { ApplicantProfile } from "@/lib/profile-types";

export default function NewSubmissionPage() {
  return (
    <Suspense fallback={<p className="text-sm text-graphite/60">Loading application form…</p>}>
      <NewSubmissionContent />
    </Suspense>
  );
}

function NewSubmissionContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("event") || undefined;
  const [profile, setProfile] = useState<ApplicantProfile | null>(null);

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  if (profile && !profile.completion.can_submit_applications) {
    return (
      <div className="mx-auto max-w-lg">
        <h1 className="font-serif text-3xl text-emerald">New Application</h1>
        <p className="mt-4 text-sm text-graphite/75">
          Complete your applicant profile before submitting a conference application.
        </p>
        <ul className="mt-4 list-inside list-disc text-sm text-graphite/70">
          {profile.completion.missing_fields.slice(0, 8).map((m) => (
            <li key={`${m.section}-${m.field}`}>{m.label}</li>
          ))}
        </ul>
        <Link
          href="/profile"
          className="mt-6 inline-block rounded-sm bg-emerald px-4 py-2 text-sm text-ivory"
        >
          Complete Profile
        </Link>
      </div>
    );
  }

  const profileName =
    profile?.full_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="mx-auto max-w-3xl pb-24">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-emerald">New Application</h1>
        <p className="mt-2 text-sm text-graphite/70">
          Complete all sections below. Your progress is saved as a draft until you submit.
        </p>
      </header>

      <ApplicationSubmissionForm
        defaultEventId={eventId}
        profileName={profileName}
        profile={profile}
      />
    </div>
  );
}

