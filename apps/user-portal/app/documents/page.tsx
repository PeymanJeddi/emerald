"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProfile } from "@/lib/profile-api";
import type { ApplicantProfile } from "@/lib/profile-types";

export default function DocumentsPage() {
  const [profile, setProfile] = useState<ApplicantProfile | null>(null);

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  const identity = (profile?.profile.identity || {}) as Record<string, string>;
  const status = profile?.completion.identity_verification_status || "not_submitted";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-serif text-3xl text-emerald">Documents</h1>
      <p className="text-sm text-graphite/70">
        Manage identity and academic documents for verification.
      </p>

      <div className="archival-card rounded-sm p-6">
        <h2 className="font-serif text-lg text-emerald">Identity document</h2>
        <p className="mt-1 text-sm capitalize text-graphite/70">Status: {status.replace(/_/g, " ")}</p>
        {identity.document_type && (
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-graphite/50">Type</dt>
              <dd>{identity.document_type}</dd>
            </div>
            <div>
              <dt className="text-graphite/50">Number</dt>
              <dd>{identity.document_number || "—"}</dd>
            </div>
          </dl>
        )}
        <Link href="/profile" className="mt-4 inline-block text-sm text-emerald hover:underline">
          Update in profile →
        </Link>
      </div>

      <div className="archival-card rounded-sm p-6 opacity-80">
        <h2 className="font-serif text-lg text-emerald">Academic documents</h2>
        <p className="mt-2 text-sm text-graphite/65">
          CV, degree certificate, and transcript uploads will be available in a future release.
          For now, include links in your researcher profile section.
        </p>
      </div>
    </div>
  );
}
