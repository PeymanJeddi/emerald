"use client";

import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type EventRecord = Record<string, unknown>;

const STATUSES = [
  "Upcoming",
  "Submission Open",
  "Registration Open",
  "Ongoing",
  "Completed",
  "Archived",
  "Closed",
];

export function EventEditor({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [contentJson, setContentJson] = useState("{}");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<EventRecord>(`/api/admin/events/${eventId}`)
      .then((e) => {
        setEvent(e);
        setContentJson(JSON.stringify(e.content_json ?? {}, null, 2));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, [eventId]);

  function field(name: string, value: string) {
    setEvent((prev) => (prev ? { ...prev, [name]: value } : prev));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!event) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(contentJson);
    } catch {
      setError("Content JSON is invalid.");
      setSaving(false);
      return;
    }
    try {
      await apiFetch(`/api/admin/events/${eventId}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: event.title,
          slug: event.slug,
          event_code: event.event_code,
          subtitle: event.subtitle || null,
          event_type: event.event_type || null,
          category: event.category || null,
          location: event.location || null,
          country: event.country || null,
          format: event.format || null,
          start_date: event.start_date || null,
          end_date: event.end_date || null,
          submission_deadline: event.submission_deadline || null,
          registration_deadline: event.registration_deadline || null,
          status: event.status,
          overview: event.overview || null,
          short_description: event.short_description || null,
          cover_image_url: event.cover_image_url || null,
          hero_image_url: event.hero_image_url || null,
          hero_video_url: event.hero_video_url || null,
          video_thumbnail_url: event.video_thumbnail_url || null,
          seo_title: event.seo_title || null,
          seo_description: event.seo_description || null,
          content_json: parsed,
          is_public: event.is_public !== false,
        }),
      });
      setMessage("Event saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (!event) {
    return <p className="text-graphite/60">{error || "Loading…"}</p>;
  }

  const publicUrl = `/conferences/${String(event.slug)}`;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs text-gold">{String(event.event_code)}</p>
          <h1 className="font-serif text-3xl text-emerald">Edit Event</h1>
        </div>
        <div className="flex gap-3 text-sm">
          <a href={publicUrl} target="_blank" rel="noreferrer" className="text-emerald underline">
            Preview public page
          </a>
          <Link href="/events" className="text-emerald underline">
            ← Events
          </Link>
        </div>
      </div>

      {message ? <p className="mb-4 text-sm text-emerald">{message}</p> : null}
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <form onSubmit={handleSave} className="space-y-8">
        <section className="archival-card space-y-4 rounded-sm p-6">
          <h2 className="font-serif text-xl text-emerald">Basic information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {(
              [
                "title",
                "slug",
                "event_code",
                "subtitle",
                "event_type",
                "category",
                "status",
                "format",
                "location",
                "country",
              ] as const
            ).map((f) => (
              <label key={f} className="block text-sm capitalize">
                {f.replace(/_/g, " ")}
                {f === "status" ? (
                  <select
                    value={String(event.status ?? "")}
                    onChange={(e) => field("status", e.target.value)}
                    className="mt-1 w-full rounded-sm border border-border px-3 py-2"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={String(event[f] ?? "")}
                    onChange={(e) => field(f, e.target.value)}
                    className="mt-1 w-full rounded-sm border border-border px-3 py-2"
                  />
                )}
              </label>
            ))}
          </div>
          <textarea
            placeholder="Short description"
            value={String(event.short_description ?? "")}
            onChange={(e) => field("short_description", e.target.value)}
            rows={2}
            className="w-full rounded-sm border border-border px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Overview (plain text fallback)"
            value={String(event.overview ?? "")}
            onChange={(e) => field("overview", e.target.value)}
            rows={4}
            className="w-full rounded-sm border border-border px-3 py-2 text-sm"
          />
        </section>

        <section className="archival-card space-y-4 rounded-sm p-6">
          <h2 className="font-serif text-xl text-emerald">Dates</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {(["start_date", "end_date", "submission_deadline", "registration_deadline"] as const).map(
              (f) => (
                <label key={f} className="block text-sm capitalize">
                  {f.replace(/_/g, " ")}
                  <input
                    type="date"
                    value={String(event[f] ?? "").slice(0, 10)}
                    onChange={(e) => field(f, e.target.value)}
                    className="mt-1 w-full rounded-sm border border-border px-3 py-2"
                  />
                </label>
              )
            )}
          </div>
        </section>

        <section className="archival-card space-y-4 rounded-sm p-6">
          <h2 className="font-serif text-xl text-emerald">Hero & media</h2>
          <p className="text-xs text-graphite/55">
            On the public page: video URL shows a player; otherwise hero/cover image is used.
          </p>
          {(["cover_image_url", "hero_image_url", "hero_video_url", "video_thumbnail_url"] as const).map(
            (f) => (
              <input
                key={f}
                placeholder={f.replace(/_/g, " ")}
                value={String(event[f] ?? "")}
                onChange={(e) => field(f, e.target.value)}
                className="w-full rounded-sm border border-border px-3 py-2 text-sm"
              />
            )
          )}
        </section>

        <section className="archival-card space-y-4 rounded-sm p-6">
          <h2 className="font-serif text-xl text-emerald">SEO</h2>
          <input
            placeholder="SEO title"
            value={String(event.seo_title ?? "")}
            onChange={(e) => field("seo_title", e.target.value)}
            className="w-full rounded-sm border border-border px-3 py-2 text-sm"
          />
          <textarea
            placeholder="SEO description"
            value={String(event.seo_description ?? "")}
            onChange={(e) => field("seo_description", e.target.value)}
            rows={2}
            className="w-full rounded-sm border border-border px-3 py-2 text-sm"
          />
        </section>

        <section className="archival-card space-y-4 rounded-sm p-6">
          <h2 className="font-serif text-xl text-emerald">Page sections (JSON)</h2>
          <p className="text-xs text-graphite/55">
            Structured content: overview_markdown, important_dates, topics, people_groups, submission,
            schedule, venue, gallery, videos, publications, sponsors, faq, cta, footer_cta, hero.
          </p>
          <textarea
            value={contentJson}
            onChange={(e) => setContentJson(e.target.value)}
            rows={24}
            className="w-full rounded-sm border border-border px-3 py-2 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </section>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-sm bg-emerald px-6 py-2 text-sm text-ivory disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save event"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/events")}
            className="rounded-sm border border-border px-6 py-2 text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
