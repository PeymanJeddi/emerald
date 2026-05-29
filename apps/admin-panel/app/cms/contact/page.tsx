"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

type Section = {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  config_json: Record<string, unknown> | null;
  order_index: number;
};

export default function CMSContactPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [editing, setEditing] = useState<Section | null>(null);
  const [jsonDraft, setJsonDraft] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function load() {
    apiFetch<Section[]>("/api/admin/cms/sections?page_key=contact").then(setSections);
  }

  useEffect(() => {
    load();
  }, []);

  function openEdit(section: Section) {
    setEditing(section);
    setTitle(section.title ?? "");
    setSubtitle(section.subtitle ?? "");
    setBody(section.body ?? "");
    setJsonDraft(JSON.stringify(section.config_json ?? {}, null, 2));
    setMessage("");
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    setMessage("");
    try {
      const config_json = jsonDraft.trim() ? JSON.parse(jsonDraft) : null;
      await apiFetch(`/api/admin/cms/sections/${editing.id}`, {
        method: "PATCH",
        body: JSON.stringify({ title, subtitle, body, config_json }),
      });
      setMessage("Saved.");
      setEditing(null);
      load();
    } catch {
      setMessage("Invalid JSON or save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl text-emerald">Contact Page CMS</h1>
        <Link href="/cms" className="text-sm text-emerald-accent hover:underline">
          Back to CMS
        </Link>
      </div>
      <p className="mt-2 text-sm text-graphite/60">
        Hero, contact cards, form copy, departments, office, FAQ, social links, and CTA.
      </p>
      <div className="mt-8 space-y-3">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => openEdit(s)}
            className="archival-card flex w-full items-start justify-between rounded-sm p-4 text-left hover:border-emerald"
          >
            <div>
              <p className="text-xs text-gold">{s.section_key}</p>
              <p className="font-medium">{s.title || s.section_key}</p>
            </div>
            <span className="text-xs text-graphite/40">#{s.order_index}</span>
          </button>
        ))}
      </div>
      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-sm border border-border bg-ivory p-6 shadow-lg">
            <h2 className="font-serif text-xl text-emerald">Edit: {editing.section_key}</h2>
            <div className="mt-4 space-y-3">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full rounded-sm border border-border px-3 py-2 text-sm" />
              <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Subtitle" className="w-full rounded-sm border border-border px-3 py-2 text-sm" />
              <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" rows={4} className="w-full rounded-sm border border-border px-3 py-2 text-sm" />
              <textarea value={jsonDraft} onChange={(e) => setJsonDraft(e.target.value)} rows={14} className="w-full font-mono text-xs rounded-sm border border-border px-3 py-2" />
            </div>
            {message ? <p className="mt-3 text-sm text-gold">{message}</p> : null}
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={save} disabled={saving} className="rounded-sm bg-emerald px-4 py-2 text-sm text-ivory">
                {saving ? "Saving…" : "Save"}
              </button>
              <button type="button" onClick={() => setEditing(null)} className="rounded-sm border border-border px-4 py-2 text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
