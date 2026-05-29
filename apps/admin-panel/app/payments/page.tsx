"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Array<Record<string, string>>>([]);

  useEffect(() => {
    apiFetch<Array<Record<string, string>>>("/api/admin/payments").then(setPayments);
  }, []);

  async function approve(id: string) {
    await apiFetch(`/api/admin/payments/${id}/approve`, { method: "PATCH" });
    apiFetch<Array<Record<string, string>>>("/api/admin/payments").then(setPayments);
  }

  async function reject(id: string) {
    await apiFetch(`/api/admin/payments/${id}/reject`, { method: "PATCH" });
    apiFetch<Array<Record<string, string>>>("/api/admin/payments").then(setPayments);
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-emerald">Payments</h1>
      <div className="mt-6 space-y-3">
        {payments.map((p) => (
          <div key={p.id} className="archival-card rounded-sm p-4">
            <p>{p.amount} {p.currency} — <span className="capitalize">{p.status}</span></p>
            {(p.status === "submitted" || p.status === "under_review") && (
              <div className="mt-2 flex gap-2">
                <button onClick={() => approve(p.id)} className="text-xs text-emerald underline">Approve</button>
                <button onClick={() => reject(p.id)} className="text-xs text-red-600 underline">Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
