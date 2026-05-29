"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function CertificatesPage() {
  const [certs, setCerts] = useState<
    Array<{ id: string; certificate_code: string; holder_name: string; event_title_snapshot: string; status: string }>
  >([]);

  useEffect(() => {
    apiFetch<Array<{ id: string; certificate_code: string; holder_name: string; event_title_snapshot: string; status: string }>>(
      "/api/me/certificates"
    ).then(setCerts);
  }, []);

  return (
    <div>
      <h1 className="font-serif text-3xl text-emerald">Certificates</h1>
      <div className="mt-8 space-y-4">
        {certs.map((c) => (
          <div key={c.id} className="archival-card rounded-sm p-4">
            <p className="text-xs text-gold">{c.certificate_code}</p>
            <p className="font-medium">{c.holder_name}</p>
            <p className="text-sm capitalize text-graphite/60">{c.status}</p>
            <p className="text-sm text-graphite/60">{c.event_title_snapshot}</p>
            <a
              href={`${process.env.NEXT_PUBLIC_PUBLIC_WEB_URL || "http://localhost:3000"}/verify/${c.certificate_code}`}
              className="mt-2 inline-block text-sm text-emerald underline"
            >
              Public verification link
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
