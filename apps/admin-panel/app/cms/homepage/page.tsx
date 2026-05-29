"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function CMSHomepagePage() {
  const [sections, setSections] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    apiFetch<Array<Record<string, unknown>>>("/api/admin/cms/sections?page_key=homepage").then(setSections);
  }, []);

  return (
    <div>
      <h1 className="font-serif text-3xl text-emerald">Homepage CMS</h1>
      <div className="mt-6 space-y-4">
        {sections.map((s) => (
          <div key={String(s.id)} className="archival-card rounded-sm p-4">
            <p className="text-xs text-gold">{String(s.section_key)}</p>
            <p className="font-medium">{String(s.title)}</p>
            <p className="text-sm text-graphite/60">{String(s.subtitle || s.body || "").slice(0, 120)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
