import type { ApplicationFormState, SectionId, SectionStatus } from "./types";
import type { SubmissionFileRecord } from "./types";

export type SectionErrors = Partial<Record<string, string>>;

export function validateAgreements(form: ApplicationFormState): SectionErrors {
  const errors: SectionErrors = {};
  if (!form.integrity_accepted) {
    errors.integrity_accepted = "You must confirm academic integrity.";
  }
  if (!form.terms_accepted) {
    errors.terms_accepted = "You must accept the submission terms.";
  }
  return errors;
}

export function validateSection(
  section: SectionId,
  form: ApplicationFormState,
  files: SubmissionFileRecord[]
): SectionErrors {
  const errors: SectionErrors = {};

  switch (section) {
    case "event":
      if (!form.event_id) errors.event_id = "Select a conference or event.";
      if (!form.presenting_format) errors.presenting_format = "Select a presenting format.";
      break;
    case "details":
      if (!form.title.trim()) errors.title = "Title is required.";
      else if (form.title.trim().length < 5) errors.title = "Title must be at least 5 characters.";
      if (!form.abstract.trim()) errors.abstract = "Abstract is required.";
      else if (form.abstract.trim().length < 50)
        errors.abstract = "Abstract must be at least 50 characters.";
      if (!form.keywords.trim()) errors.keywords = "Keywords are required.";
      break;
    case "authors":
      if (!form.certificate_name.trim())
        errors.certificate_name = "Presenting author name for certificate is required.";
      if (!form.certificate_role.trim()) errors.certificate_role = "Author role is required.";
      break;
    case "files": {
      const hasManuscript = files.some(
        (f) => f.file_type === "paper" || f.file_type === "manuscript"
      );
      if (!hasManuscript) errors.manuscript = "Upload at least one manuscript file.";
      break;
    }
    case "review":
      Object.assign(errors, validateAgreements(form));
      break;
  }

  return errors;
}

export function isSectionComplete(
  section: SectionId,
  form: ApplicationFormState,
  files: SubmissionFileRecord[]
): boolean {
  return Object.keys(validateSection(section, form, files)).length === 0;
}

export function allSectionsCompleteBeforeReview(
  form: ApplicationFormState,
  files: SubmissionFileRecord[]
): boolean {
  return (
    isSectionComplete("event", form, files) &&
    isSectionComplete("details", form, files) &&
    isSectionComplete("authors", form, files) &&
    isSectionComplete("files", form, files) &&
    isSectionComplete("review", form, files)
  );
}

export function getSectionStatus(
  section: SectionId,
  form: ApplicationFormState,
  files: SubmissionFileRecord[]
): SectionStatus {
  if (section === "review") {
    const priorComplete =
      isSectionComplete("event", form, files) &&
      isSectionComplete("details", form, files) &&
      isSectionComplete("authors", form, files) &&
      isSectionComplete("files", form, files);
    if (!priorComplete) return "locked";
    return isSectionComplete("review", form, files) ? "completed" : "incomplete";
  }
  return isSectionComplete(section, form, files) ? "completed" : "incomplete";
}
