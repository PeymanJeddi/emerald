"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Submission = { id: string; submission_code: string; title: string | null; status: string };

export default function SubmissionsPage() {
  const [items, setItems] = useState<Submission[]>([]);

  useEffect(() => {
    apiFetch<Submission[]>("/api/me/submissions").then(setItems);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-emerald">Submissions</h1>
        <Link href="/submissions/new" className="rounded-sm bg-emerald px-4 py-2 text-sm text-ivory">New Submission</Link>
      </div>
      <div className="mt-8 space-y-4">
        {items.map((s) => (
          <Link key={s.id} href={`/submissions/${s.id}`} className="archival-card block rounded-sm p-4 hover:border-emerald">
            <p className="text-xs text-gold">{s.submission_code}</p>
            <p className="font-medium">{s.title || "Untitled"}</p>
            <p className="text-sm capitalize text-graphite/60">{s.status.replace(/_/g, " ")}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
