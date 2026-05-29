"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function CertificateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [cert, setCert] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (id) apiFetch<Record<string, unknown>>(`/api/admin/certificates/${id}`).then(setCert);
  }, [id]);

  async function revoke() {
    const reason = prompt("Revocation reason:");
    if (!reason) return;
    await apiFetch(`/api/admin/certificates/${id}/revoke`, { method: "POST", body: JSON.stringify({ revoke_reason: reason }) });
    apiFetch<Record<string, unknown>>(`/api/admin/certificates/${id}`).then(setCert);
  }

  if (!cert) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl">
      <p className="text-xs text-gold">{String(cert.certificate_code)}</p>
      <h1 className="font-serif text-3xl text-emerald">{String(cert.holder_name)}</h1>
      <p className="capitalize">{String(cert.status)}</p>
      {cert.status === "verified" && (
        <button onClick={revoke} className="mt-4 rounded-sm border border-red-300 px-4 py-2 text-sm text-red-700">
          Revoke Certificate
        </button>
      )}
    </div>
  );
}
