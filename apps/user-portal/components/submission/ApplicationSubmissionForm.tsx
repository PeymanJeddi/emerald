"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CoAuthorsSection } from "@/components/submission/CoAuthorsSection";
import { FormField, inputClass } from "@/components/submission/FormField";
import { SubmissionFormSection } from "@/components/submission/SubmissionFormSection";
import { getPresentingAuthorName } from "@/lib/profile-display";
import type { ApplicantProfile } from "@/lib/profile-types";
import { getCoAuthors } from "@/lib/submissions/authors-api";
import {
  createSubmissionDraft,
  fetchUpcomingEvents,
  getSubmission,
  submitApplication,
  updateSubmissionDraft,
  uploadSubmissionFile,
} from "@/lib/submissions/api";
import { formFromSubmission } from "@/lib/submissions/notes";
import {
  INITIAL_FORM_STATE,
  ORDERED_SECTIONS,
  SECTION_META,
  type ApplicationFormState,
  type EventOption,
  type SectionId,
  type SubmissionFileRecord,
  type SubmissionRecord,
} from "@/lib/submissions/types";
import {
  allSectionsCompleteBeforeReview,
  getSectionStatus,
  isSectionComplete,
  validateSection,
} from "@/lib/submissions/validation";

interface Props {
  submissionId?: string;
  defaultEventId?: string;
  profileName?: string;
  profile?: ApplicantProfile | null;
}

export function ApplicationSubmissionForm({
  submissionId: initialId,
  defaultEventId,
  profileName,
  profile = null,
}: Props) {
  const router = useRouter();
  const applicantName =
    getPresentingAuthorName(profile) || profileName?.trim() || "";

  const [form, setForm] = useState<ApplicationFormState>(() => ({
    ...INITIAL_FORM_STATE,
    event_id: defaultEventId || "",
    certificate_name: applicantName,
  }));
  const [events, setEvents] = useState<EventOption[]>([]);
  const [submissionId, setSubmissionId] = useState<string | undefined>(initialId);
  const [submissionRecord, setSubmissionRecord] = useState<SubmissionRecord | null>(null);
  const [files, setFiles] = useState<SubmissionFileRecord[]>([]);
  const [submissionCode, setSubmissionCode] = useState<string | null>(null);
  const [touched, setTouched] = useState<Partial<Record<SectionId, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const patch = useCallback((partial: Partial<ApplicationFormState>) => {
    setForm((prev) => ({ ...prev, ...partial }));
  }, []);

  useEffect(() => {
    fetchUpcomingEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

  useEffect(() => {
    if (!applicantName) return;
    setForm((prev) =>
      prev.certificate_name.trim() ? prev : { ...prev, certificate_name: applicantName }
    );
  }, [applicantName]);

  useEffect(() => {
    if (!initialId) return;
    getSubmission(initialId)
      .then((sub) => applySubmission(sub))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load draft"));
  }, [initialId]);

  function applySubmission(sub: SubmissionRecord) {
    setSubmissionId(sub.id);
    setSubmissionRecord(sub);
    setSubmissionCode(sub.submission_code);
    setFiles(sub.files || []);
    setForm((prev) => {
      const merged = formFromSubmission(sub, {
        ...prev,
        certificate_name: prev.certificate_name || applicantName,
      });
      return merged;
    });
  }

  const sectionStatuses = useMemo(() => {
    const map = {} as Record<SectionId, ReturnType<typeof getSectionStatus>>;
    for (const id of ORDERED_SECTIONS) {
      map[id] = getSectionStatus(id, form, files);
    }
    return map;
  }, [form, files]);

  const hasManuscript = files.some(
    (f) => f.file_type === "paper" || f.file_type === "manuscript"
  );

  const priorSectionsComplete =
    isSectionComplete("event", form, files) &&
    isSectionComplete("details", form, files) &&
    isSectionComplete("authors", form, files) &&
    isSectionComplete("files", form, files);
  const canSubmit = allSectionsCompleteBeforeReview(form, files);

  async function saveDraft(): Promise<SubmissionRecord | null> {
    setSaving(true);
    setError(null);
    setSaveMessage(null);
    try {
      if (!form.title.trim()) {
        setError("Enter a title to save your draft.");
        setTouched((t) => ({ ...t, details: true }));
        return null;
      }
      const sub = submissionId
        ? await updateSubmissionDraft(submissionId, form)
        : await createSubmissionDraft(form);
      applySubmission(sub);
      setLastSaved(new Date());
      setSaveMessage("Draft saved.");
      return sub;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save draft");
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function ensureDraftId(): Promise<string | null> {
    if (submissionId) return submissionId;
    const sub = await saveDraft();
    return sub?.id ?? null;
  }

  async function handleFileUpload(file: File, fileType: string) {
    setUploading(true);
    setError(null);
    try {
      const id = await ensureDraftId();
      if (!id) return;
      await uploadSubmissionFile(id, file, fileType);
      const refreshed = await getSubmission(id);
      applySubmission(refreshed);
      setTouched((t) => ({ ...t, files: false }));
      setSaveMessage("File uploaded.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
      markTouched("files");
    } finally {
      setUploading(false);
    }
  }

  function markTouched(section: SectionId) {
    setTouched((t) => ({ ...t, [section]: true }));
  }

  function sectionErrors(section: SectionId) {
    if (!touched[section]) return {};
    return validateSection(section, form, files);
  }

  async function handleSubmit() {
    markTouched("event");
    markTouched("details");
    markTouched("authors");
    markTouched("files");
    markTouched("review");

    if (!allSectionsCompleteBeforeReview(form, files)) {
      setError("Complete all required sections before submitting.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const id = await ensureDraftId();
      if (!id) return;
      await updateSubmissionDraft(id, form);
      const result = await submitApplication(id);
      router.push(`/submissions/${result.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  const selectedEvent = events.find((e) => e.id === form.event_id);

  return (
    <div className="space-y-6">
      <div className="archival-card rounded-sm border-gold/30 bg-soft-white p-5">
        <h2 className="font-serif text-lg text-emerald">Before you begin</h2>
        <p className="mt-2 text-sm leading-relaxed text-graphite/75">
          Complete each section below in order. You can save a draft at any time and return later.
          All required fields are marked with an asterisk. Your application is not sent until you
          confirm in Review &amp; Submit.
        </p>
        <ul className="mt-3 list-inside list-disc text-sm text-graphite/70">
          <li>Prepare your title, abstract, and keywords in English.</li>
          <li>List co-authors accurately if applicable.</li>
          <li>Upload manuscript files in PDF, DOC, or DOCX format.</li>
          <li>Accept the submission agreements before final submit.</li>
        </ul>
        {submissionCode && (
          <p className="mt-3 text-xs text-graphite/50">
            Draft reference: <span className="font-medium text-gold">{submissionCode}</span>
          </p>
        )}
      </div>

      {error && (
        <p className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {saveMessage && !error && (
        <p className="text-sm text-emerald">{saveMessage}</p>
      )}

      <div className="archival-card divide-y divide-border rounded-sm px-5 py-2 sm:px-8">
        <div className="py-8">
        <SubmissionFormSection
          sectionNumber={SECTION_META.event.order}
          title={SECTION_META.event.title}
          subtitle={SECTION_META.event.helper}
          status={sectionStatuses.event}
        >
          <div className="space-y-4" onBlur={() => markTouched("event")}>
            <FormField
              id="event_id"
              label="Conference / Event"
              helper="Choose the event you are applying to."
              required
              error={sectionErrors("event").event_id}
            >
              <select
                id="event_id"
                value={form.event_id}
                onChange={(e) => patch({ event_id: e.target.value })}
                className={inputClass}
              >
                <option value="">Select event…</option>
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              id="presenting_format"
              label="Presenting format"
              helper="Choose whether you will present online or in person."
              required
              error={sectionErrors("event").presenting_format}
            >
              <select
                id="presenting_format"
                value={form.presenting_format}
                onChange={(e) =>
                  patch({ presenting_format: e.target.value as "Online" | "In-person" })
                }
                className={inputClass}
              >
                <option value="Online">Online</option>
                <option value="In-person">In-person</option>
              </select>
            </FormField>
          </div>
        </SubmissionFormSection>
        </div>

        <div className="py-8">
        <SubmissionFormSection
          sectionNumber={SECTION_META.details.order}
          title={SECTION_META.details.title}
          subtitle={SECTION_META.details.helper}
          status={sectionStatuses.details}
        >
          <div className="space-y-4" onBlur={() => markTouched("details")}>
            <FormField
              id="title"
              label="Submission title"
              required
              error={sectionErrors("details").title}
            >
              <input
                id="title"
                value={form.title}
                onChange={(e) => patch({ title: e.target.value })}
                className={inputClass}
              />
            </FormField>
            <FormField
              id="abstract"
              label="Abstract"
              helper="Minimum 50 characters. Paste your conference abstract."
              required
              error={sectionErrors("details").abstract}
            >
              <textarea
                id="abstract"
                value={form.abstract}
                onChange={(e) => patch({ abstract: e.target.value })}
                rows={6}
                className={inputClass}
              />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                id="keywords"
                label="Keywords"
                helper="Comma-separated."
                required
                error={sectionErrors("details").keywords}
              >
                <input
                  id="keywords"
                  value={form.keywords}
                  onChange={(e) => patch({ keywords: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. NLP, education, AI ethics"
                />
              </FormField>
              <FormField
                id="subject_areas"
                label="Subject areas / topics"
                helper="Domains or tracks that best describe your work."
              >
                <input
                  id="subject_areas"
                  value={form.subject_areas}
                  onChange={(e) => patch({ subject_areas: e.target.value })}
                  className={inputClass}
                />
              </FormField>
            </div>
          </div>
        </SubmissionFormSection>
        </div>

        <div className="py-8">
        <SubmissionFormSection
          sectionNumber={SECTION_META.authors.order}
          title={SECTION_META.authors.title}
          subtitle={SECTION_META.authors.helper}
          status={sectionStatuses.authors}
        >
          <div onBlur={() => markTouched("authors")}>
            <CoAuthorsSection
              submissionId={submissionId}
              submission={submissionRecord}
              profile={profile}
              certificateName={form.certificate_name}
              certificateRole={form.certificate_role}
              onCertificateChange={(name, role) =>
                patch({ certificate_name: name, certificate_role: role })
              }
              certificateNameError={sectionErrors("authors").certificate_name}
              certificateRoleError={sectionErrors("authors").certificate_role}
              onSubmissionRefresh={applySubmission}
              onEnsureDraft={ensureDraftId}
            />
          </div>
        </SubmissionFormSection>
        </div>

        <div className="py-8">
        <SubmissionFormSection
          sectionNumber={SECTION_META.files.order}
          title={SECTION_META.files.title}
          subtitle={SECTION_META.files.helper}
          status={sectionStatuses.files}
        >
          <div className="space-y-5">
            <FileSlot
              id="file-manuscript"
              label="Manuscript / full paper"
              required
              disabled={uploading}
              uploading={uploading}
              uploaded={hasManuscript}
              error={
                touched.files && !hasManuscript && !uploading
                  ? sectionErrors("files").manuscript
                  : undefined
              }
              onSelect={(f) => f && handleFileUpload(f, "paper")}
            />
            <FileSlot
              id="file-cover"
              label="Cover letter"
              optional
              disabled={uploading}
              onSelect={(f) => f && handleFileUpload(f, "cover_letter")}
            />
            {files.length > 0 && (
              <ul className="rounded-sm border border-border bg-ivory/50 px-4 py-3 text-sm">
                {files.map((f) => (
                  <li key={f.id} className="flex justify-between gap-2 py-1">
                    <span className="text-graphite">{f.original_filename}</span>
                    <span className="text-xs uppercase text-graphite/50">{f.file_type}</span>
                  </li>
                ))}
              </ul>
            )}
            {!submissionId && !uploading && (
              <p className="text-xs text-graphite/55">
                A draft with a title is created automatically when you select a file.
              </p>
            )}
          </div>
        </SubmissionFormSection>
        </div>

        <div className="py-8">
        <SubmissionFormSection
          sectionNumber={SECTION_META.review.order}
          title={SECTION_META.review.title}
          subtitle={SECTION_META.review.helper}
          status={sectionStatuses.review}
          notice={
            !priorSectionsComplete
              ? "Complete all required sections above before you can submit your application."
              : undefined
          }
        >
          <div className="space-y-4" onBlur={() => markTouched("review")}>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <ReviewItem label="Event" value={selectedEvent?.title || "—"} />
              <ReviewItem label="Presenting format" value={form.presenting_format} />
              <ReviewItem label="Title" value={form.title || "—"} className="sm:col-span-2" />
              <ReviewItem label="Presenting author" value={form.certificate_name || "—"} />
              <ReviewItem
                label="Co-authors"
                value={
                  submissionRecord
                    ? String(getCoAuthors(submissionRecord).length)
                    : "0"
                }
              />
              <ReviewItem label="Files uploaded" value={String(files.length)} />
            </dl>

            <div className="space-y-3 border-t border-border pt-4">
              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.integrity_accepted}
                  onChange={(e) => patch({ integrity_accepted: e.target.checked })}
                  className="mt-1"
                />
                <span>
                  I confirm this submission is original, not under review elsewhere, and complies
                  with academic integrity standards.
                  <span className="text-red-600"> *</span>
                </span>
              </label>
              {sectionErrors("review").integrity_accepted && (
                <p className="text-xs text-red-700">{sectionErrors("review").integrity_accepted}</p>
              )}
              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.terms_accepted}
                  onChange={(e) => patch({ terms_accepted: e.target.checked })}
                  className="mt-1"
                />
                <span>
                  I accept the conference submission terms, author agreement, and data processing
                  notice.
                  <span className="text-red-600"> *</span>
                </span>
              </label>
              {sectionErrors("review").terms_accepted && (
                <p className="text-xs text-red-700">{sectionErrors("review").terms_accepted}</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !canSubmit}
              className="rounded-sm bg-emerald px-6 py-2.5 text-sm font-medium text-ivory hover:bg-emerald-accent disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit application"}
            </button>
          </div>
        </SubmissionFormSection>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 -mx-1 border-t border-border bg-ivory/95 px-1 py-4 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-graphite/55">
            {lastSaved
              ? `Last saved ${lastSaved.toLocaleTimeString()}`
              : submissionId
                ? "Draft in progress"
                : "Not saved yet"}
          </div>
          <button
            type="button"
            onClick={saveDraft}
            disabled={saving}
            className="rounded-sm border border-emerald px-5 py-2 text-sm font-medium text-emerald hover:bg-soft-white disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save draft"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewItem({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs uppercase tracking-widest text-graphite/45">{label}</dt>
      <dd className="mt-0.5 text-graphite">{value}</dd>
    </div>
  );
}

function FileSlot({
  id,
  label,
  required,
  optional,
  disabled,
  uploading,
  uploaded,
  error,
  onSelect,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  uploading?: boolean;
  uploaded?: boolean;
  error?: string;
  onSelect: (file: File | null) => void;
}) {
  return (
    <FormField id={id} label={label} required={required} error={error}>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        disabled={disabled}
        className="block w-full text-sm text-graphite/80 file:mr-4 file:rounded-sm file:border-0 file:bg-emerald file:px-4 file:py-2 file:text-sm file:text-ivory hover:file:bg-emerald-accent disabled:opacity-50"
        onChange={(e) => onSelect(e.target.files?.[0] ?? null)}
      />
      {uploading && (
        <p className="mt-1 text-xs text-graphite/60">Uploading…</p>
      )}
      {uploaded && !uploading && (
        <p className="mt-1 text-xs text-emerald">File uploaded successfully.</p>
      )}
      {optional && !uploading && !uploaded && (
        <p className="mt-1 text-xs text-graphite/50">Optional</p>
      )}
    </FormField>
  );
}
