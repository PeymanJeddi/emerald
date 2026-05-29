"use client";

import { apiFetch, API_URL } from "@/lib/api";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Slide = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  background_image_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  cta_type: string;
  display_priority: number;
  is_active: boolean;
  publish_at: string | null;
  expires_at: string | null;
};

const emptyForm = {
  title: "",
  subtitle: "",
  description: "",
  cta_label: "Apply Now",
  cta_url: "/portal/signup",
  cta_type: "internal",
  display_priority: 0,
  is_active: true,
  publish_at: "",
  expires_at: "",
};

export default function HeroCarouselAdminPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [editing, setEditing] = useState<Slide | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const data = await apiFetch<Slide[]>("/api/admin/cms/hero-slides");
    setSlides(data);
  }, []);

  useEffect(() => {
    load().catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [load]);

  function startCreate() {
    setEditing(null);
    setForm({ ...emptyForm, display_priority: slides.length });
  }

  function startEdit(slide: Slide) {
    setEditing(slide);
    setForm({
      title: slide.title,
      subtitle: slide.subtitle ?? "",
      description: slide.description ?? "",
      cta_label: slide.cta_label ?? "",
      cta_url: slide.cta_url ?? "",
      cta_type: slide.cta_type,
      display_priority: slide.display_priority,
      is_active: slide.is_active,
      publish_at: slide.publish_at ? slide.publish_at.slice(0, 16) : "",
      expires_at: slide.expires_at ? slide.expires_at.slice(0, 16) : "",
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    const body = {
      title: form.title,
      subtitle: form.subtitle || null,
      description: form.description || null,
      cta_label: form.cta_label || null,
      cta_url: form.cta_url || null,
      cta_type: form.cta_type,
      display_priority: form.display_priority,
      is_active: form.is_active,
      publish_at: form.publish_at ? new Date(form.publish_at).toISOString() : null,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
    };
    try {
      if (editing) {
        await apiFetch(`/api/admin/cms/hero-slides/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
        setMessage("Slide updated.");
      } else {
        await apiFetch("/api/admin/cms/hero-slides", { method: "POST", body: JSON.stringify(body) });
        setMessage("Slide created.");
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
    if (!confirm("Delete this slide?")) return;
    await apiFetch(`/api/admin/cms/hero-slides/${id}`, { method: "DELETE" });
    await load();
  }

  async function moveSlide(id: string, direction: -1 | 1) {
    const idx = slides.findIndex((s) => s.id === id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= slides.length) return;
    const reordered = [...slides];
    const a = reordered[idx];
    const b = reordered[swapIdx];
    reordered[idx] = { ...b, display_priority: a.display_priority };
    reordered[swapIdx] = { ...a, display_priority: b.display_priority };
    await apiFetch("/api/admin/cms/hero-slides/reorder", {
      method: "POST",
      body: JSON.stringify({
        slides: reordered.map((s, i) => ({ id: s.id, display_priority: i })),
      }),
    });
    await load();
  }

  async function uploadImage(id: string, file: File) {
    const token = localStorage.getItem("esc_admin_token");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API_URL}/api/admin/cms/hero-slides/${id}/image`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: fd,
    });
    if (!res.ok) throw new Error("Image upload failed");
    await load();
    setMessage("Background image uploaded.");
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-emerald">Hero Carousel</h1>
          <p className="mt-1 text-sm text-graphite/60">Manage homepage hero slides, scheduling, and CTAs.</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={startCreate}
            className="rounded-sm bg-emerald px-4 py-2 text-sm text-ivory"
          >
            + New slide
          </button>
          <Link href="/cms" className="text-sm text-emerald hover:underline self-center">
            ← CMS
          </Link>
        </div>
      </div>

      {message ? <p className="mb-4 text-sm text-emerald">{message}</p> : null}
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          {slides.map((slide) => (
            <div key={slide.id} className="archival-card rounded-sm p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{slide.title}</p>
                  <p className="text-xs text-graphite/55">
                    Priority {slide.display_priority} · {slide.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => moveSlide(slide.id, -1)} className="text-xs text-emerald">
                    ↑
                  </button>
                  <button type="button" onClick={() => moveSlide(slide.id, 1)} className="text-xs text-emerald">
                    ↓
                  </button>
                  <button type="button" onClick={() => startEdit(slide)} className="text-xs text-emerald">
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(slide.id)} className="text-xs text-red-700">
                    Delete
                  </button>
                </div>
              </div>
              {slide.background_image_url ? (
                <p className="mt-2 truncate text-xs text-graphite/50">{slide.background_image_url}</p>
              ) : null}
              <label className="mt-2 block text-xs text-graphite/60">
                Upload background
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full text-xs"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadImage(slide.id, f).catch(() => setError("Upload failed"));
                  }}
                />
              </label>
            </div>
          ))}
        </div>

        <form onSubmit={handleSave} className="archival-card space-y-4 rounded-sm p-6">
          <h2 className="font-serif text-xl text-emerald">{editing ? "Edit slide" : "New slide"}</h2>
          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-sm border border-border px-3 py-2 text-sm"
          />
          <input
            placeholder="Subtitle"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            className="w-full rounded-sm border border-border px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Description"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-sm border border-border px-3 py-2 text-sm"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              placeholder="CTA label"
              value={form.cta_label}
              onChange={(e) => setForm({ ...form, cta_label: e.target.value })}
              className="rounded-sm border border-border px-3 py-2 text-sm"
            />
            <input
              placeholder="CTA URL"
              value={form.cta_url}
              onChange={(e) => setForm({ ...form, cta_url: e.target.value })}
              className="rounded-sm border border-border px-3 py-2 text-sm"
            />
          </div>
          <select
            value={form.cta_type}
            onChange={(e) => setForm({ ...form, cta_type: e.target.value })}
            className="w-full rounded-sm border border-border px-3 py-2 text-sm"
          >
            <option value="internal">Internal route</option>
            <option value="external">External URL</option>
          </select>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs">
              Publish at
              <input
                type="datetime-local"
                value={form.publish_at}
                onChange={(e) => setForm({ ...form, publish_at: e.target.value })}
                className="mt-1 w-full rounded-sm border border-border px-2 py-2 text-sm"
              />
            </label>
            <label className="text-xs">
              Expires at
              <input
                type="datetime-local"
                value={form.expires_at}
                onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                className="mt-1 w-full rounded-sm border border-border px-2 py-2 text-sm"
              />
            </label>
          </div>
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
            {saving ? "Saving…" : editing ? "Update slide" : "Create slide"}
          </button>
        </form>
      </div>
    </div>
  );
}
