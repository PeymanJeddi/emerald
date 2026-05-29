import { API_URL, apiFetch, getToken } from "@/lib/api";
import type { ApplicationFormState, EventOption, SubmissionRecord } from "./types";
import { serializeNotes } from "./notes";

type EventListResponse = { items: { id: string; title: string; slug?: string }[] };

export async function fetchUpcomingEvents(): Promise<EventOption[]> {
  const data = await apiFetch<EventListResponse>("/api/public/events?tab=upcoming&limit=50");
  return (data.items || []).map((e) => ({ id: e.id, title: e.title, slug: e.slug }));
}

function toPayload(form: ApplicationFormState) {
  return {
    event_id: form.event_id || null,
    title: form.title.trim() || null,
    abstract: form.abstract || null,
    keywords: form.keywords || null,
    participation_type: "Presenter",
    attendance_format: form.presenting_format,
    certificate_name: form.certificate_name || null,
    certificate_role: form.certificate_role || null,
    notes: serializeNotes(form),
  };
}

export async function createSubmissionDraft(
  form: ApplicationFormState
): Promise<SubmissionRecord> {
  return apiFetch<SubmissionRecord>("/api/me/submissions", {
    method: "POST",
    body: JSON.stringify(toPayload(form)),
  });
}

export async function updateSubmissionDraft(
  id: string,
  form: ApplicationFormState
): Promise<SubmissionRecord> {
  return apiFetch<SubmissionRecord>(`/api/me/submissions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(toPayload(form)),
  });
}

export async function getSubmission(id: string): Promise<SubmissionRecord> {
  return apiFetch<SubmissionRecord>(`/api/me/submissions/${id}`);
}

export async function submitApplication(id: string): Promise<SubmissionRecord> {
  return apiFetch<SubmissionRecord>(`/api/me/submissions/${id}/submit`, {
    method: "POST",
  });
}

export async function uploadSubmissionFile(
  submissionId: string,
  file: File,
  fileType: string
): Promise<{ id: string; filename: string }> {
  const token = getToken();
  const body = new FormData();
  body.append("file", file);

  const res = await fetch(
    `${API_URL}/api/me/submissions/${submissionId}/files?file_type=${encodeURIComponent(fileType)}`,
    {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body,
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(typeof err.detail === "string" ? err.detail : "Upload failed");
  }
  return res.json();
}
