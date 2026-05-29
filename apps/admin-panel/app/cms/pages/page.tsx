"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function CMSPagesPage() {
  const [pages, setPages] = useState<Array<Record<string, string>>>([]);

  useEffect(() => {
    apiFetch<Array<Record<string, string>>>("/api/admin/cms/pages").then(setPages);
  }, []);

  return (
    <div>
      <h1 className="font-serif text-3xl text-emerald">CMS Pages</h1>
      <div className="mt-6 space-y-3">
        {pages.map((p) => (
          <div key={p.id} className="archival-card rounded-sm p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="text-sm text-graphite/60">/{p.slug}</p>
            </div>
            {p.slug === "terms" ? (
              <Link href="/cms/terms" className="text-sm text-emerald hover:underline">
                Edit markdown →
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
