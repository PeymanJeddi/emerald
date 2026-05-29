"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<Array<Record<string, string>>>([]);

  useEffect(() => {
    apiFetch<Array<Record<string, string>>>("/api/admin/audit-logs").then(setLogs);
  }, []);

  return (
    <div>
      <h1 className="font-serif text-3xl text-emerald">Audit Logs</h1>
      <div className="mt-6 space-y-2 text-sm">
        {logs.map((l) => (
          <div key={l.id} className="archival-card rounded-sm px-4 py-2">
            <span className="text-gold">{l.action}</span> · {l.entity_type} · {new Date(l.created_at).toLocaleString()}
          </div>
        ))}
      </div>
    </div>
  );
}
