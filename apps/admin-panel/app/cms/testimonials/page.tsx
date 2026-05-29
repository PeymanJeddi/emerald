"use client";

import { apiFetch, API_URL } from "@/lib/api";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Testimonial = {
  id: string;
  full_name: string;
  position_title: string | null;
  institution: string | null;
  country: string | null;
  profile_image_url: string | null;
  testimonial_text: string;
  rating: number | null;
  display_priority: number;
  is_active: boolean;
};

const emptyForm = {
  full_name: "",
  position_title: "",
  institution: "",
  country: "",
  testimonial_text: "",
  rating: 5,
  display_priority: 0,
  is_active: true,
};

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const data = await apiFetch<Testimonial[]>("/api/admin/cms/testimonials");
    setItems(data);
  }, []);

  useEffect(() => {
    load().catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [load]);

  function startCreate() {
    setEditing(null);
    setForm({ ...emptyForm, display_priority: items.length });
  }

  function startEdit(item: Testimonial) {
    setEditing(item);
    setForm({
      full_name: item.full_name,
      position_title: item.position_title ?? "",
      institution: item.institution ?? "",
      country: item.country ?? "",
      testimonial_text: item.testimonial_text,
      rating: item.rating ?? 5,
      display_priority: item.display_priority,
      is_active: item.is_active,
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    const body = {
      full_name: form.full_name,
      position_title: form.position_title || null,
      institution: form.institution || null,
      country: form.country || null,
      testimonial_text: form.testimonial_text,
      rating: form.rating,
      display_priority: form.display_priority,
      is_active: form.is_active,
    };
    try {
      if (editing) {
        await apiFetch(`/api/admin/cms/testimonials/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
        setMessage("Testimonial updated.");
      } else {
        await apiFetch("/api/admin/cms/testimonials", { method: "POST", body: JSON.stringify(body) });
        setMessage("Testimonial created.");
      }
      await load();
      setEditing(null);
      setForm(emptyForm);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await apiFetch(`/api/admin/cms/testimonials/${id}`, { method: "DELETE" });
    await load();
  }

  async function moveItem(id: string, direction: -1 | 1) {
    const idx = items.findIndex((i) => i.id === id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= items.length) return;
    const reordered = [...items];
    const a = reordered[idx];
    const b = reordered[swapIdx];
    reordered[idx] = { ...b, display_priority: a.display_priority };
    reordered[swapIdx] = { ...a, display_priority: b.display_priority };
    await apiFetch("/api/admin/cms/testimonials/reorder", {
      method: "POST",
      body: JSON.stringify({
        items: reordered.map((i, index) => ({ id: i.id, display_priority: index })),
      }),
    });
    await load();
  }

  async function uploadImage(id: string, file: File) {
    const token = localStorage.getItem("esc_admin_token");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API_URL}/api/admin/cms/testimonials/${id}/image`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: fd,
    });
    if (!res.ok) throw new Error("Upload failed");
    await load();
    setMessage("Profile image uploaded.");
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-emerald">Testimonials</h1>
          <p className="mt-1 text-sm text-graphite/60">Manage homepage testimonials carousel.</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={startCreate} className="rounded-sm bg-emerald px-4 py-2 text-sm text-ivory">
            + New testimonial
          </button>
          <Link href="/cms" className="self-center text-sm text-emerald hover:underline">
            ← CMS
          </Link>
        </div>
      </div>
      {message ? <p className="mb-4 text-sm text-emerald">{message}</p> : null}
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="archival-card rounded-sm p-4">
              <p className="font-medium">{item.full_name}</p>
              <p className="text-sm text-graphite/60 line-clamp-2">{item.testimonial_text}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" onClick={() => moveItem(item.id, -1)} className="text-xs text-emerald">
                  ↑
                </button>
                <button type="button" onClick={() => moveItem(item.id, 1)} className="text-xs text-emerald">
                  ↓
                </button>
                <button type="button" onClick={() => startEdit(item)} className="text-xs text-emerald">
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(item.id)} className="text-xs text-red-700">
                  Delete
                </button>
              </div>
              <label className="mt-2 block text-xs text-graphite/60">
                Profile image
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full text-xs"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadImage(item.id, f).catch(() => setError("Upload failed"));
                  }}
                />
              </label>
            </div>
          ))}
        </div>
        <form onSubmit={handleSave} className="archival-card space-y-4 rounded-sm p-6">
          <h2 className="font-serif text-xl text-emerald">{editing ? "Edit" : "New"} testimonial</h2>
          <input
            required
            placeholder="Full name"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="w-full rounded-sm border border-border px-3 py-2 text-sm"
          />
          <input
            placeholder="Position / title"
            value={form.position_title}
            onChange={(e) => setForm({ ...form, position_title: e.target.value })}
            className="w-full rounded-sm border border-border px-3 py-2 text-sm"
          />
          <input
            placeholder="Institution"
            value={form.institution}
            onChange={(e) => setForm({ ...form, institution: e.target.value })}
            className="w-full rounded-sm border border-border px-3 py-2 text-sm"
          />
          <input
            placeholder="Country"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            className="w-full rounded-sm border border-border px-3 py-2 text-sm"
          />
          <textarea
            required
            rows={5}
            placeholder="Testimonial text"
            value={form.testimonial_text}
            onChange={(e) => setForm({ ...form, testimonial_text: e.target.value })}
            className="w-full rounded-sm border border-border px-3 py-2 text-sm"
          />
          <input
            type="number"
            min={1}
            max={5}
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
            className="w-24 rounded-sm border border-border px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            Active
          </label>
          <button
            type="submit"
            disabled={saving}
            className="rounded-sm bg-emerald px-6 py-2 text-sm text-ivory disabled:opacity-60"
          >
            {saving ? "Saving…" : editing ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}
