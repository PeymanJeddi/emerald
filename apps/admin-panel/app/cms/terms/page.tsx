"use client";

import { MarkdownPreview } from "@/components/cms/MarkdownPreview";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type CmsPage = {
  id: number;
  key: string;
  title: string;
  slug: string;
  content_json: Record<string, unknown>;
  is_published: boolean;
};

export default function TermsEditorPage() {
  const [page, setPage] = useState<CmsPage | null>(null);
  const [heading, setHeading] = useState("Terms & Conditions");
  const [markdown, setMarkdown] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pages = await apiFetch<CmsPage[]>("/api/admin/cms/pages");
      const terms = pages.find((p) => p.slug === "terms" || p.key === "terms");
      if (terms) {
        setPage(terms);
        const c = terms.content_json ?? {};
        setHeading(typeof c.heading === "string" ? c.heading : "Terms & Conditions");
        setMarkdown(typeof c.body_markdown === "string" ? c.body_markdown : "");
        setUpdatedAt(typeof c.updated_at === "string" ? c.updated_at : "");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load page");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    const content_json = {
      heading,
      body_markdown: markdown,
      updated_at: updatedAt || new Date().toISOString().slice(0, 10),
    };
    try {
      if (page) {
        const updated = await apiFetch<CmsPage>(`/api/admin/cms/pages/${page.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            title: "Terms & Conditions",
            content_json,
            is_published: true,
          }),
        });
        setPage(updated);
        setMessage("Terms page saved successfully.");
      } else {
        const created = await apiFetch<CmsPage>("/api/admin/cms/pages", {
          method: "POST",
          body: JSON.stringify({
            key: "terms",
            title: "Terms & Conditions",
            slug: "terms",
            content_json,
            is_published: true,
          }),
        });
        setPage(created);
        setMessage("Terms page created and published.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-graphite/60">Loading…</p>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-emerald">Terms & Conditions</h1>
          <p className="mt-1 text-sm text-graphite/60">
            Markdown content for the public page at{" "}
            <span className="font-mono text-emerald">/terms</span>
          </p>
        </div>
        <Link href="/cms" className="text-sm text-emerald hover:underline">
          ← Back to CMS
        </Link>
      </div>

      {error ? (
        <p className="mb-4 rounded-sm border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="mb-4 rounded-sm border border-emerald/30 bg-emerald/5 px-4 py-2 text-sm text-emerald">
          {message}
        </p>
      ) : null}

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-graphite">Page heading</label>
          <input
            type="text"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="mt-1 w-full max-w-xl rounded-sm border border-border bg-soft-white px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-graphite">
            Last updated (shown on public page)
          </label>
          <input
            type="text"
            placeholder="e.g. 2026-05-23"
            value={updatedAt}
            onChange={(e) => setUpdatedAt(e.target.value)}
            className="mt-1 w-full max-w-xs rounded-sm border border-border bg-soft-white px-3 py-2"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-graphite">
              Body (Markdown)
            </label>
            <p className="mt-1 text-xs text-graphite/55">
              Use ## for sections, **bold**, lists, and [links](/contact).
            </p>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              rows={24}
              className="mt-2 w-full rounded-sm border border-border bg-soft-white px-3 py-2 font-mono text-sm leading-relaxed"
              spellCheck={false}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-graphite">Preview</label>
            <div className="mt-2">
              <MarkdownPreview content={markdown} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-sm bg-emerald px-6 py-2 text-sm font-medium text-ivory hover:bg-emerald-dark disabled:opacity-60"
        >
          {saving ? "Saving…" : page ? "Save changes" : "Create & publish page"}
        </button>
      </form>
    </div>
  );
}
