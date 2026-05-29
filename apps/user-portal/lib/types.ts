export type ConferenceStatus =
  | "Completed"
  | "Upcoming"
  | "Open for Registration";

export type EventFormat = "Online" | "Hybrid" | "In-person";

export interface Conference {
  title: string;
  slug: string;
  date: string;
  location: string;
  format: EventFormat;
  status: ConferenceStatus;
  category: string;
  eventReferenceCode: string;
  overview: string;
}

export type CertificateStatus = "Verified" | "Pending" | "Revoked";

export interface Certificate {
  code: string;
  status: CertificateStatus;
  holderName: string;
  eventTitle: string;
  eventSlug: string;
  eventDate: string;
  location: string;
  format: EventFormat;
  role: string;
  recordType: string;
  presentationTitle: string;
  issueDate: string;
  eventReferenceCode: string;
  verificationMessage: string;
}
