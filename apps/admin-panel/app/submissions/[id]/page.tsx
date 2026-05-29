"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

const STATUSES = [
  "submitted",
  "administrative_screening",
  "document_review",
  "academic_review",
  "revision_requested",
  "accepted",
  "certificate_issued",
  "rejected",
];

type CertificateRow = {
  id: string;
  certificate_code: string;
  status: string;
  submission_id: string | null;
};

export default function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sub, setSub] = useState<Record<string, unknown> | null>(null);
  const [linkedCert, setLinkedCert] = useState<CertificateRow | null>(null);

  async function loadLinkedCert(submissionId: string) {
    try {
      const certs = await apiFetch<CertificateRow[]>("/api/admin/certificates");
      setLinkedCert(certs.find((c) => c.submission_id === submissionId) ?? null);
    } catch {
      setLinkedCert(null);
    }
  }

  useEffect(() => {
    if (!id) return;
    apiFetch<Record<string, unknown>>(`/api/admin/submissions/${id}`).then((data) => {
      setSub(data);
      loadLinkedCert(String(data.id));
    });
  }, [id]);

  async function setStatus(status: string) {
    await apiFetch(`/api/admin/submissions/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    const updated = await apiFetch<Record<string, unknown>>(`/api/admin/submissions/${id}`);
    setSub(updated);
    await loadLinkedCert(String(updated.id));
  }

  if (!sub) return <p>Loading...</p>;

  const submissionCode = String(sub.submission_code);
  const isIssued = String(sub.status) === "certificate_issued";
  const publicWebBase =
    process.env.NEXT_PUBLIC_PUBLIC_WEB_URL || "http://localhost:3000";
  const publicVerifyUrl = `${publicWebBase}/verify/${submissionCode}`;

  return (
    <div className="max-w-2xl">
      <p className="text-xs text-gold">{submissionCode}</p>
      <h1 className="font-serif text-3xl text-emerald">{String(sub.title)}</h1>
      <p className="mt-2 capitalize text-sm">{String(sub.status).replace(/_/g, " ")}</p>

      {isIssued ? (
        <div className="mt-4 rounded-sm border border-gold/40 bg-ivory p-4 text-sm">
          <p className="font-medium text-emerald">Certificate issued</p>
          <p className="mt-1 text-graphite/70">
            Public verification:{" "}
            <Link href={publicVerifyUrl} className="font-mono text-emerald-accent hover:underline" target="_blank" rel="noreferrer">
              /verify/{submissionCode}
            </Link>
          </p>
          {linkedCert ? (
            <p className="mt-2 text-xs text-graphite/60">
              Certificate record: {linkedCert.certificate_code} ({linkedCert.status})
              {" · "}
              <Link href={`/certificates/${linkedCert.id}`} className="text-emerald hover:underline">
                Edit certificate
              </Link>
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className="rounded-sm border border-border px-3 py-1 text-xs hover:border-emerald"
          >
            {s.replace(/_/g, " ")}
          </button>
        ))}
      </div>
    </div>
  );
}
