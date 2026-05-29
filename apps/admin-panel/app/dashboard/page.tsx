"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Record<string, number>>({});

  useEffect(() => {
    apiFetch<Record<string, number>>("/api/admin/dashboard").then(setStats);
  }, []);

  const cards = [
    { label: "Total Users", key: "total_users" },
    { label: "Active Submissions", key: "active_submissions" },
    { label: "Pending Payments", key: "pending_payments" },
    { label: "Issued Certificates", key: "issued_certificates" },
    { label: "Published Events", key: "published_events" },
    { label: "Pending Reviews", key: "pending_reviews" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-emerald">Dashboard</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <div key={c.key} className="archival-card rounded-sm p-6">
            <p className="text-2xl font-serif text-emerald">{stats[c.key] ?? "—"}</p>
            <p className="text-sm text-graphite/60">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
