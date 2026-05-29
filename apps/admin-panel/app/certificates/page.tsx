"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Array<Record<string, string>>>([]);

  useEffect(() => {
    apiFetch<Array<Record<string, string>>>("/api/admin/certificates").then(setCerts);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-emerald">Certificates</h1>
        <Link href="/certificates/new" className="rounded-sm bg-emerald px-4 py-2 text-sm text-ivory">New</Link>
      </div>
      <div className="mt-6 space-y-3">
        {certs.map((c) => (
          <Link key={c.id} href={`/certificates/${c.id}`} className="archival-card block rounded-sm p-4">
            <p className="text-xs text-gold">{c.certificate_code}</p>
            <p>{c.holder_name}</p>
            <p className="text-sm capitalize">{c.status}</p>
            <p className="text-xs text-emerald">http://localhost:3000/verify/{c.certificate_code}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
