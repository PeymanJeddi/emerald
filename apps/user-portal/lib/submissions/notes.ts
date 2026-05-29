import type { ApplicationExtendedData, ApplicationFormState, PresentingFormat } from "./types";

const NOTES_PREFIX = "esc_app_v1:";

export function normalizePresentingFormat(value: string | null | undefined): PresentingFormat {
  if (!value) return "In-person";
  const lower = value.toLowerCase();
  if (lower === "online" || lower === "virtual" || lower === "hybrid") return "Online";
  return "In-person";
}

export function extendedFromForm(form: ApplicationFormState): ApplicationExtendedData {
  return {
    subject_areas: form.subject_areas,
    terms_accepted: form.terms_accepted,
    integrity_accepted: form.integrity_accepted,
  };
}

export function serializeNotes(form: ApplicationFormState): string {
  return NOTES_PREFIX + JSON.stringify(extendedFromForm(form));
}

export function parseNotes(notes: string | null | undefined): Partial<ApplicationExtendedData> {
  if (!notes) return {};
  const raw = notes.startsWith(NOTES_PREFIX) ? notes.slice(NOTES_PREFIX.length) : notes;
  try {
    return JSON.parse(raw) as Partial<ApplicationExtendedData>;
  } catch {
    return {};
  }
}

export function formFromSubmission(
  sub: {
    event_id: string | null;
    title: string | null;
    abstract: string | null;
    keywords: string | null;
    attendance_format: string | null;
    certificate_name: string | null;
    certificate_role: string | null;
    notes: string | null;
  },
  base: ApplicationFormState
): ApplicationFormState {
  const ext = parseNotes(sub.notes);
  return {
    ...base,
    event_id: sub.event_id ?? "",
    presenting_format: normalizePresentingFormat(sub.attendance_format),
    title: sub.title || "",
    abstract: sub.abstract || "",
    keywords: sub.keywords || "",
    certificate_name: sub.certificate_name?.trim() || base.certificate_name,
    certificate_role: sub.certificate_role || base.certificate_role,
    subject_areas: ext.subject_areas ?? "",
    terms_accepted: ext.terms_accepted ?? false,
    integrity_accepted: ext.integrity_accepted ?? false,
  };
}
