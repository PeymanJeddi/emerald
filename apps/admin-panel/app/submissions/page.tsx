"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function SubmissionsPage() {
  const [items, setItems] = useState<Array<Record<string, string>>>([]);

  useEffect(() => {
    apiFetch<Array<Record<string, string>>>("/api/admin/submissions").then(setItems);
  }, []);

  return (
    <div>
      <h1 className="font-serif text-3xl text-emerald">Submissions</h1>
      <div className="mt-6 space-y-3">
        {items.map((s) => (
          <Link key={s.id} href={`/submissions/${s.id}`} className="archival-card block rounded-sm p-4">
            <p className="text-xs text-gold">{s.submission_code}</p>
            <p>{s.title || "Untitled"}</p>
            <p className="text-sm capitalize text-graphite/60">{String(s.status).replace(/_/g, " ")}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
