"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ApplicationSubmissionForm } from "@/components/submission/ApplicationSubmissionForm";
import { getProfile } from "@/lib/profile-api";
import type { ApplicantProfile } from "@/lib/profile-types";
import { getSubmission } from "@/lib/submissions/api";
import type { SubmissionRecord } from "@/lib/submissions/types";

export default function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sub, setSub] = useState<SubmissionRecord | null>(null);
  const [profile, setProfile] = useState<ApplicantProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  useEffect(() => {
    if (!id) return;
    getSubmission(id)
      .then(setSub)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [id]);

  if (error) {
    return <p className="text-sm text-red-700">{error}</p>;
  }

  if (!sub) {
    return <p className="text-sm text-graphite/60">Loading submission…</p>;
  }

  const isDraft = sub.status === "draft" || sub.status === "revision_requested";

  if (isDraft) {
    return (
      <div className="mx-auto max-w-3xl pb-24">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-gold">
            {sub.submission_code}
          </p>
          <h1 className="font-serif text-3xl text-emerald">Continue application</h1>
          <p className="mt-2 text-sm capitalize text-graphite/60">
            Status: {sub.status.replace(/_/g, " ")}
          </p>
        </header>
        <ApplicationSubmissionForm submissionId={sub.id} profile={profile} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-xs font-medium uppercase tracking-widest text-gold">{sub.submission_code}</p>
      <h1 className="font-serif text-3xl text-emerald">{sub.title || "Submission"}</h1>
      <p className="mt-2 capitalize text-sm text-graphite/60">{sub.status.replace(/_/g, " ")}</p>
      {sub.abstract && (
        <div className="archival-card mt-6 rounded-sm p-4 text-sm leading-relaxed text-graphite/85">
          {sub.abstract}
        </div>
      )}
      {sub.files.length > 0 && (
        <div className="archival-card mt-6 rounded-sm p-4">
          <h2 className="font-serif text-lg text-emerald">Uploaded files</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {sub.files.map((f) => (
              <li key={f.id}>{f.original_filename}</li>
            ))}
          </ul>
        </div>
      )}
      <Link href="/submissions" className="mt-8 inline-block text-sm text-emerald hover:underline">
        ← Back to applications
      </Link>
    </div>
  );
}
