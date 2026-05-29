"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Array<Record<string, string>>>([]);

  useEffect(() => {
    apiFetch<Array<Record<string, string>>>("/api/me/payments").then(setPayments);
  }, []);

  return (
    <div>
      <h1 className="font-serif text-3xl text-emerald">Payments</h1>
      <div className="mt-8 space-y-4">
        {payments.length === 0 && <p className="text-sm text-graphite/60">No payment records.</p>}
        {payments.map((p) => (
          <div key={p.id} className="archival-card rounded-sm p-4">
            <p className="font-medium">{p.amount} {p.currency}</p>
            <p className="text-sm capitalize text-graphite/60">{p.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
