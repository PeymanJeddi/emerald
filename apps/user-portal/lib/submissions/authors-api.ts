import { apiFetch } from "@/lib/api";
import type {
  AuthorInvitationRecord,
  SubmissionAuthorRecord,
  SubmissionRecord,
} from "./types";

export type { AuthorInvitationRecord, SubmissionAuthorRecord };

export interface UserLookupPreview {
  id: string;
  full_name: string;
  email: string;
  institution: string | null;
  country: string | null;
  profile_photo_url: string | null;
  email_verified: boolean;
  profile_status: string | null;
  status: string;
}

export interface UserLookupResult {
  exists: boolean;
  message: string | null;
  user: UserLookupPreview | null;
  error_code: string | null;
}

export type LookupUiState =
  | "idle"
  | "found"
  | "not_found"
  | "already_added"
  | "self_email"
  | "limit_reached"
  | "inactive"
  | "unverified"
  | "error";

export function lookupUserByEmail(
  email: string,
  submissionId?: string
): Promise<UserLookupResult> {
  const params = new URLSearchParams({ email });
  if (submissionId) params.set("submission_id", submissionId);
  return apiFetch<UserLookupResult>(`/api/me/users/lookup?${params}`);
}

export function addCoAuthor(submissionId: string, userId: string) {
  return apiFetch<SubmissionAuthorRecord>(`/api/me/submissions/${submissionId}/authors`, {
    method: "POST",
    body: JSON.stringify({ user_id: userId, role: "co_author" }),
  });
}

export function removeCoAuthor(submissionId: string, authorId: string) {
  return apiFetch<void>(`/api/me/submissions/${submissionId}/authors/${authorId}`, {
    method: "DELETE",
  });
}

export function sendCoAuthorInvitation(submissionId: string, email: string) {
  return apiFetch<AuthorInvitationRecord>(
    `/api/me/submissions/${submissionId}/author-invitations`,
    {
      method: "POST",
      body: JSON.stringify({ email }),
    }
  );
}

export function cancelCoAuthorInvitation(submissionId: string, invitationId: string) {
  return apiFetch<void>(
    `/api/me/submissions/${submissionId}/author-invitations/${invitationId}`,
    { method: "DELETE" }
  );
}

export function resendCoAuthorInvitation(submissionId: string, invitationId: string) {
  return apiFetch<AuthorInvitationRecord>(
    `/api/me/submissions/${submissionId}/author-invitations/${invitationId}/resend`,
    { method: "POST" }
  );
}

export function getCoAuthors(submission: SubmissionRecord): SubmissionAuthorRecord[] {
  return (submission.authors || []).filter((a) => a.role === "co_author");
}

export function getPrimaryAuthor(submission: SubmissionRecord): SubmissionAuthorRecord | undefined {
  return (submission.authors || []).find((a) => a.role === "primary_author");
}
