export type SectionId = "event" | "details" | "authors" | "files" | "review";

export type SectionStatus = "completed" | "incomplete" | "locked";

export type PresentingFormat = "Online" | "In-person";

export interface ApplicationExtendedData {
  subject_areas: string;
  terms_accepted: boolean;
  integrity_accepted: boolean;
}

export interface ApplicationFormState {
  event_id: string;
  presenting_format: PresentingFormat;
  title: string;
  abstract: string;
  keywords: string;
  subject_areas: string;
  certificate_name: string;
  certificate_role: string;
  terms_accepted: boolean;
  integrity_accepted: boolean;
}

export const INITIAL_FORM_STATE: ApplicationFormState = {
  event_id: "",
  presenting_format: "In-person",
  title: "",
  abstract: "",
  keywords: "",
  subject_areas: "",
  certificate_name: "",
  certificate_role: "Presenter",
  terms_accepted: false,
  integrity_accepted: false,
};

export interface SubmissionFileRecord {
  id: string;
  file_type: string;
  original_filename: string;
}

export interface SubmissionAuthorRecord {
  id: string;
  submission_id: string;
  user_id: string;
  email: string;
  full_name: string;
  institution: string | null;
  country: string | null;
  profile_photo_url: string | null;
  role: string;
  author_order: number;
  status: string;
  added_at: string;
}

export interface AuthorInvitationRecord {
  id: string;
  submission_id: string;
  invited_email: string;
  status: string;
  created_at: string;
  sent_at: string | null;
  expires_at: string;
}

export interface SubmissionRecord {
  id: string;
  submission_code: string;
  event_id: string | null;
  title: string | null;
  abstract: string | null;
  keywords: string | null;
  participation_type: string | null;
  attendance_format: string | null;
  certificate_name: string | null;
  certificate_role: string | null;
  status: string;
  notes: string | null;
  files: SubmissionFileRecord[];
  authors?: SubmissionAuthorRecord[];
  author_invitations?: AuthorInvitationRecord[];
}

export interface EventOption {
  id: string;
  title: string;
  slug?: string;
}

export const SECTION_META: Record<
  SectionId,
  { title: string; helper: string; order: number }
> = {
  event: {
    title: "Event Information",
    helper: "Select the conference and how you will present (online or in person).",
    order: 1,
  },
  details: {
    title: "Submission Details",
    helper: "Provide the title, abstract, keywords, and subject areas for your work.",
    order: 2,
  },
  authors: {
    title: "Authors & Contributors",
    helper:
      "Add up to 2 co-authors to your application. Co-authors must have an active account on the platform. If they are not registered yet, invite them to join using their email address.",
    order: 3,
  },
  files: {
    title: "Files",
    helper: "Upload your manuscript and optional cover letter.",
    order: 4,
  },
  review: {
    title: "Review & Submit",
    helper: "Review your application, accept the agreements, and submit.",
    order: 5,
  },
};

export const ORDERED_SECTIONS: SectionId[] = [
  "event",
  "details",
  "authors",
  "files",
  "review",
];
