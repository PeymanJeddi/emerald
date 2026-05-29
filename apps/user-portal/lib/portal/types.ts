export type SubmissionStatus =
  | "Draft"
  | "Submitted"
  | "Administrative Screening"
  | "Document Review"
  | "Academic Review"
  | "Revision Requested"
  | "Accepted"
  | "Certificate Issued"
  | "Archived"
  | "Rejected";

export type PortalRole =
  | "Independent Researcher"
  | "Student"
  | "Faculty Member"
  | "Industry Professional"
  | "Research Associate";

export type ParticipationType =
  | "Presenter"
  | "Participant"
  | "Author"
  | "Workshop Participant";

export type AttendanceFormat = "Online" | "In-person" | "Hybrid";

export interface PortalUser {
  fullName: string;
  displayName: string;
  email: string;
  country: string;
  city: string;
  affiliation: string;
  role: PortalRole;
  bio: string;
  researchInterests: string[];
  department?: string;
  website?: string;
  orcid?: string;
  linkedin?: string;
}

export interface UserSubmission {
  id: string;
  title: string;
  eventSlug: string;
  eventTitle: string;
  status: SubmissionStatus;
  submittedAt: string | null;
  lastUpdated: string;
  certificateCode: string | null;
  participationType?: ParticipationType;
  attendanceFormat?: AttendanceFormat;
  uploadedFiles?: string[];
  certificateName?: string;
  notes?: string[];
  requiredActions?: string[];
}

export interface PortalMessage {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface PortalCertificate {
  code: string;
  holderName: string;
  eventTitle: string;
  role: string;
  issueDate: string;
  status: "Verified" | "Pending";
  verificationUrl: string;
}

export interface PortalCertificate {
  code: string;
  holderName: string;
  eventTitle: string;
  role: string;
  issueDate: string;
  status: "Verified" | "Pending";
  verificationUrl: string;
}

export const SUBMISSION_STATUS_ORDER: SubmissionStatus[] = [
  "Draft",
  "Submitted",
  "Administrative Screening",
  "Document Review",
  "Academic Review",
  "Revision Requested",
  "Accepted",
  "Certificate Issued",
  "Archived",
  "Rejected",
];

export const TIMELINE_STATUSES: SubmissionStatus[] = [
  "Draft",
  "Submitted",
  "Administrative Screening",
  "Document Review",
  "Academic Review",
  "Accepted",
  "Certificate Issued",
];

export const STATUS_DESCRIPTIONS: Record<SubmissionStatus, string> = {
  Draft: "The submission has been started but not yet submitted.",
  Submitted: "The submission has been received by the coordination system.",
  "Administrative Screening":
    "The submission is being checked for completeness, formatting, and required information.",
  "Document Review":
    "Uploaded files and submitted details are being reviewed.",
  "Academic Review":
    "The submitted material is being evaluated for relevance to the selected event.",
  "Revision Requested":
    "Additional information or file corrections are required.",
  Accepted: "The submission has been accepted for the selected event.",
  "Certificate Issued":
    "A certificate record has been generated and is available for verification.",
  Archived: "The submission record has been finalized and archived.",
  Rejected: "The submission was not accepted for the selected event.",
};
