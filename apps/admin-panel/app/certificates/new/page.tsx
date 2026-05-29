"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function NewCertificatePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    certificate_code: "",
    user_id: "",
    holder_name: "",
    event_title_snapshot: "",
    role: "Presenter",
    record_type: "Conference Participation Certificate",
    status: "verified",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cert = await apiFetch<{ id: string }>("/api/admin/certificates", { method: "POST", body: JSON.stringify(form) });
    router.push(`/certificates/${cert.id}`);
  }

  return (
    <div className="max-w-lg">
      <h1 className="font-serif text-3xl text-emerald">New Certificate</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {Object.entries(form).map(([k, v]) => (
          <input key={k} placeholder={k} value={v} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="w-full rounded-sm border border-border px-4 py-2 text-sm" required={k === "certificate_code" || k === "user_id" || k === "holder_name"} />
        ))}
        <button type="submit" className="rounded-sm bg-emerald px-4 py-2 text-sm text-ivory">Create</button>
      </form>
    </div>
  );
}
