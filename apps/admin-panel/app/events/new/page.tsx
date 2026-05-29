"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function NewEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    event_code: "",
    location: "",
    format: "Hybrid",
    status: "Upcoming",
    overview: "",
    is_public: true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    const event = await apiFetch<{ id: string }>("/api/admin/events", {
      method: "POST",
      body: JSON.stringify({ ...form, slug }),
    });
    router.push(`/events/${event.id}`);
  }

  return (
    <div className="max-w-lg">
      <h1 className="font-serif text-3xl text-emerald">New Event</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {(["title", "event_code", "location", "format", "status"] as const).map((f) => (
          <input key={f} placeholder={f.replace("_", " ")} value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} className="w-full rounded-sm border border-border px-4 py-2 text-sm capitalize" required={f === "title" || f === "event_code"} />
        ))}
        <textarea placeholder="Overview" value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} rows={4} className="w-full rounded-sm border border-border px-4 py-2 text-sm" />
        <button type="submit" className="rounded-sm bg-emerald px-4 py-2 text-sm text-ivory">Create</button>
      </form>
    </div>
  );
}
