"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FormField, inputClass } from "@/components/submission/FormField";
import type { ApplicantProfile } from "@/lib/profile-types";
import {
  addCoAuthor,
  cancelCoAuthorInvitation,
  getCoAuthors,
  getPrimaryAuthor,
  lookupUserByEmail,
  removeCoAuthor,
  resendCoAuthorInvitation,
  sendCoAuthorInvitation,
  type AuthorInvitationRecord,
  type LookupUiState,
  type SubmissionAuthorRecord,
  type UserLookupPreview,
} from "@/lib/submissions/authors-api";
import type { SubmissionRecord } from "@/lib/submissions/types";

const PUBLIC_WEB = process.env.NEXT_PUBLIC_PUBLIC_WEB_URL || "http://localhost:3000";
const LOOKUP_DEBOUNCE_MS = 450;

function isValidEmailShape(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

interface Props {
  submissionId?: string;
  submission: SubmissionRecord | null;
  profile: ApplicantProfile | null;
  certificateName: string;
  certificateRole: string;
  onCertificateChange: (name: string, role: string) => void;
  certificateNameError?: string;
  certificateRoleError?: string;
  onSubmissionRefresh: (sub: SubmissionRecord) => void;
  onEnsureDraft: () => Promise<string | null>;
}

export function CoAuthorsSection({
  submissionId,
  submission,
  profile,
  certificateName,
  certificateRole,
  onCertificateChange,
  certificateNameError,
  certificateRoleError,
  onSubmissionRefresh,
  onEnsureDraft,
}: Props) {
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [lookupState, setLookupState] = useState<LookupUiState>("idle");
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);
  const [preview, setPreview] = useState<UserLookupPreview | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const lookupSeq = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const coAuthors = submission ? getCoAuthors(submission) : [];
  const primaryFromApi = submission ? getPrimaryAuthor(submission) : undefined;
  const invitations = submission?.author_invitations ?? [];
  const atLimit = coAuthors.length >= 2;

  const primaryDisplay = {
    full_name: primaryFromApi?.full_name || profile?.full_name || "—",
    email: primaryFromApi?.email || profile?.email || "—",
    institution:
      primaryFromApi?.institution ||
      profile?.affiliation ||
      (profile?.profile?.academic?.university_name as string | undefined) ||
      "—",
    country: primaryFromApi?.country || profile?.country || "—",
    photo: primaryFromApi?.profile_photo_url || profile?.profile_photo_url,
  };

  async function resolveSubmissionId(): Promise<string | null> {
    if (submissionId) return submissionId;
    return onEnsureDraft();
  }

  const applyLookupResult = useCallback((result: Awaited<ReturnType<typeof lookupUserByEmail>>) => {
    if (result.error_code === "limit_reached") {
      setLookupState("limit_reached");
      setLookupMessage(result.message);
      setPreview(null);
      return;
    }
    if (result.error_code === "self_email") {
      setLookupState("self_email");
      setLookupMessage(result.message);
      setPreview(null);
      return;
    }
    if (result.error_code === "already_added") {
      setLookupState("already_added");
      setLookupMessage(result.message);
      setPreview(null);
      return;
    }
    if (result.error_code === "inactive_user") {
      setLookupState("inactive");
      setLookupMessage(result.message);
      setPreview(null);
      return;
    }
    if (result.error_code === "unverified_email") {
      setLookupState("unverified");
      setLookupMessage(result.message);
      setPreview(null);
      return;
    }
    if (result.exists && result.user) {
      setLookupState("found");
      setPreview(result.user);
      setLookupMessage("User found on the platform.");
      return;
    }
    setLookupState("not_found");
    setPreview(null);
    setLookupMessage(
      result.message ||
        "No registered user was found with this email address. Invite them to create an account using the same email."
    );
  }, []);

  const performLookup = useCallback(
    async (rawEmail: string) => {
      const trimmed = rawEmail.trim();
      if (!isValidEmailShape(trimmed)) return;

      const seq = ++lookupSeq.current;
      setChecking(true);
      setLocalError(null);
      setPanelOpen(true);

      try {
        const result = await lookupUserByEmail(trimmed, submissionId);
        if (seq !== lookupSeq.current) return;
        applyLookupResult(result);
      } catch (e) {
        if (seq !== lookupSeq.current) return;
        setLookupState("error");
        setLocalError(e instanceof Error ? e.message : "Lookup failed");
        setPreview(null);
        setLookupMessage(null);
      } finally {
        if (seq === lookupSeq.current) setChecking(false);
      }
    },
    [submissionId, applyLookupResult]
  );

  useEffect(() => {
    const trimmed = email.trim();
    if (!trimmed) {
      lookupSeq.current += 1;
      setChecking(false);
      setLookupState("idle");
      setPreview(null);
      setLookupMessage(null);
      setLocalError(null);
      setPanelOpen(false);
      return;
    }

    if (!isValidEmailShape(trimmed)) {
      lookupSeq.current += 1;
      setChecking(false);
      setLookupState("idle");
      setPreview(null);
      setLookupMessage(null);
      setPanelOpen(false);
      return;
    }

    const timer = window.setTimeout(() => {
      void performLookup(trimmed);
    }, LOOKUP_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [email, performLookup]);

  function resetLookup() {
    lookupSeq.current += 1;
    setLookupState("idle");
    setPreview(null);
    setLookupMessage(null);
    setLocalError(null);
    setEmail("");
    setPanelOpen(false);
    setChecking(false);
  }

  async function handleAddCoAuthor() {
    if (!preview) return;
    setActionLoading(true);
    setLocalError(null);
    try {
      const sid = await resolveSubmissionId();
      if (!sid) return;
      await addCoAuthor(sid, preview.id);
      const { getSubmission } = await import("@/lib/submissions/api");
      onSubmissionRefresh(await getSubmission(sid));
      resetLookup();
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Failed to add co-author");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSendInvitation() {
    const trimmed = email.trim();
    if (!trimmed) return;
    setActionLoading(true);
    setLocalError(null);
    try {
      const sid = await resolveSubmissionId();
      if (!sid) return;
      await sendCoAuthorInvitation(sid, trimmed);
      const { getSubmission } = await import("@/lib/submissions/api");
      onSubmissionRefresh(await getSubmission(sid));
      resetLookup();
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Failed to send invitation");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRemove(authorId: string) {
    const sid = await resolveSubmissionId();
    if (!sid) return;
    setActionLoading(true);
    try {
      await removeCoAuthor(sid, authorId);
      const { getSubmission } = await import("@/lib/submissions/api");
      onSubmissionRefresh(await getSubmission(sid));
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Failed to remove co-author");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancelInvitation(invitationId: string) {
    const sid = await resolveSubmissionId();
    if (!sid) return;
    setActionLoading(true);
    try {
      await cancelCoAuthorInvitation(sid, invitationId);
      const { getSubmission } = await import("@/lib/submissions/api");
      onSubmissionRefresh(await getSubmission(sid));
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Failed to cancel invitation");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleResend(invitationId: string) {
    const sid = await resolveSubmissionId();
    if (!sid) return;
    setActionLoading(true);
    try {
      await resendCoAuthorInvitation(sid, invitationId);
      const { getSubmission } = await import("@/lib/submissions/api");
      onSubmissionRefresh(await getSubmission(sid));
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Failed to resend invitation");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <AuthorCard
        badge="Primary author"
        name={primaryDisplay.full_name}
        email={primaryDisplay.email}
        institution={primaryDisplay.institution}
        country={primaryDisplay.country}
        role="Primary applicant"
        status="Confirmed"
        photoUrl={primaryDisplay.photo}
        locked
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id="certificate_name"
          label="Presenting author (certificate name)"
          helper="From your profile — edit if needed."
          required
          error={certificateNameError}
        >
          <input
            id="certificate_name"
            value={certificateName}
            onChange={(e) => onCertificateChange(e.target.value, certificateRole)}
            className={inputClass}
          />
        </FormField>
        <FormField
          id="certificate_role"
          label="Your role"
          helper="From your profile — edit if needed."
          required
          error={certificateRoleError}
        >
          <select
            id="certificate_role"
            value={certificateRole}
            onChange={(e) => onCertificateChange(certificateName, e.target.value)}
            className={inputClass}
          >
            <option>Presenter</option>
            <option>Co-author</option>
            <option>Corresponding Author</option>
            <option>Attendee</option>
          </select>
        </FormField>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="font-serif text-lg text-emerald">Co-authors</h3>
        {coAuthors.length === 0 && invitations.length === 0 && (
          <p className="mt-2 text-sm text-graphite/65">
            No co-authors added yet. You may add up to 2 registered co-authors by entering their
            platform email address.
          </p>
        )}

        <div className="mt-4 space-y-3">
          {coAuthors.map((author) => (
            <AuthorCard
              key={author.id}
              badge="Co-author"
              name={author.full_name}
              email={author.email}
              institution={author.institution || "—"}
              country={author.country || "—"}
              role="Co-author"
              status={formatStatus(author.status)}
              photoUrl={author.profile_photo_url}
              onRemove={() => handleRemove(author.id)}
              removeDisabled={actionLoading}
            />
          ))}
        </div>

        {invitations.length > 0 && (
          <div className="mt-4 space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest text-graphite/45">
              Pending invitations
            </p>
            {invitations.map((inv) => (
              <InvitationCard
                key={inv.id}
                invitation={inv}
                onCancel={() => handleCancelInvitation(inv.id)}
                onResend={() => handleResend(inv.id)}
                disabled={actionLoading}
              />
            ))}
          </div>
        )}

        {atLimit ? (
          <p className="mt-4 rounded-sm border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-graphite/80">
            Maximum co-author limit reached
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            <FormField
              id="coauthor_email"
              label="Co-author email address"
              helper="Start typing a registered email — we will check automatically."
            >
              <div ref={containerRef} className="relative">
                <input
                  id="coauthor_email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => {
                    if (lookupState !== "idle" || checking) setPanelOpen(true);
                  }}
                  onBlur={() => {
                    window.setTimeout(() => setPanelOpen(false), 180);
                  }}
                  placeholder="Enter co-author’s platform email address"
                  className={inputClass}
                  disabled={actionLoading}
                  autoComplete="off"
                  aria-autocomplete="list"
                  aria-expanded={panelOpen}
                  aria-controls="coauthor-lookup-panel"
                />
                {checking && (
                  <span className="pointer-events-none absolute right-3 top-3 text-xs text-graphite/50">
                    Checking…
                  </span>
                )}

                {panelOpen && isValidEmailShape(email) && (
                  <div
                    id="coauthor-lookup-panel"
                    role="listbox"
                    className="absolute z-20 mt-1 w-full overflow-hidden rounded-sm border border-border bg-soft-white shadow-md"
                  >
                    {checking && lookupState === "idle" && (
                      <p className="px-4 py-3 text-sm text-graphite/60">Searching platform users…</p>
                    )}

                    {!checking && lookupState === "found" && preview && (
                      <div className="p-3">
                        <p className="text-xs font-medium uppercase tracking-widest text-emerald">
                          User found
                        </p>
                        <p className="mt-2 font-medium text-graphite">{preview.full_name}</p>
                        <p className="text-sm text-graphite/70">{preview.email}</p>
                        <p className="text-sm text-graphite/60">
                          {[preview.institution, preview.country].filter(Boolean).join(" · ") ||
                            "—"}
                        </p>
                        <p className="mt-1 text-xs text-graphite/50">
                          {preview.email_verified ? "Email verified" : "Email not verified"} ·{" "}
                          {preview.profile_status || preview.status}
                        </p>
                        <p className="mt-2 text-xs text-graphite/55">{lookupMessage}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={handleAddCoAuthor}
                            disabled={actionLoading}
                            className="rounded-sm bg-emerald px-3 py-1.5 text-sm text-ivory hover:bg-emerald-accent disabled:opacity-50"
                          >
                            Add as Co-author
                          </button>
                        </div>
                      </div>
                    )}

                    {!checking && lookupState === "not_found" && (
                      <div className="p-3">
                        <p className="text-xs font-medium uppercase tracking-widest text-graphite/50">
                          Not registered
                        </p>
                        <p className="mt-2 text-sm text-graphite/75">{lookupMessage}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={handleSendInvitation}
                            disabled={actionLoading}
                            className="rounded-sm bg-emerald px-3 py-1.5 text-sm text-ivory hover:bg-emerald-accent disabled:opacity-50"
                          >
                            Send Invitation
                          </button>
                          <a
                            href={`${PUBLIC_WEB}/auth/register`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onMouseDown={(e) => e.preventDefault()}
                            className="rounded-sm border border-border px-3 py-1.5 text-sm text-emerald hover:border-emerald"
                          >
                            Registration link
                          </a>
                        </div>
                      </div>
                    )}

                    {!checking &&
                      lookupState !== "idle" &&
                      lookupState !== "found" &&
                      lookupState !== "not_found" && (
                        <div className="p-3">
                          <p className="text-sm text-graphite/75">{lookupMessage}</p>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setEmail("");
                              resetLookup();
                            }}
                            className="mt-2 text-sm text-emerald hover:underline"
                          >
                            Try another email
                          </button>
                        </div>
                      )}

                    {localError && (
                      <p className="border-t border-border px-4 py-2 text-xs text-red-700">
                        {localError}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </FormField>

            {!submissionId && isValidEmailShape(email) && (
              <p className="text-xs text-graphite/55">
                Save a draft (title required) to add co-authors or send invitations.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function formatStatus(status: string) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function AuthorCard({
  badge,
  name,
  email,
  institution,
  country,
  role,
  status,
  photoUrl,
  locked,
  onRemove,
  removeDisabled,
}: {
  badge: string;
  name: string;
  email: string;
  institution: string;
  country: string;
  role: string;
  status: string;
  photoUrl?: string | null;
  locked?: boolean;
  onRemove?: () => void;
  removeDisabled?: boolean;
}) {
  return (
    <div className="flex gap-4 rounded-sm border border-border bg-ivory/40 p-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald/10 text-sm font-medium text-emerald">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
        ) : (
          name.charAt(0).toUpperCase()
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-gold">{badge}</span>
          {locked && (
            <span className="text-xs text-graphite/50">Cannot be removed</span>
          )}
        </div>
        <p className="mt-1 font-medium text-graphite">{name}</p>
        <p className="text-sm text-graphite/70">{email}</p>
        <p className="text-sm text-graphite/60">
          {institution}
          {country !== "—" ? ` · ${country}` : ""}
        </p>
        <p className="mt-1 text-xs text-graphite/50">
          {role} · {status}
        </p>
      </div>
      {onRemove && !locked && (
        <button
          type="button"
          onClick={onRemove}
          disabled={removeDisabled}
          className="shrink-0 self-start text-sm text-red-700 hover:underline disabled:opacity-50"
        >
          Remove
        </button>
      )}
    </div>
  );
}

function InvitationCard({
  invitation,
  onCancel,
  onResend,
  disabled,
}: {
  invitation: AuthorInvitationRecord;
  onCancel: () => void;
  onResend: () => void;
  disabled?: boolean;
}) {
  const sent = invitation.sent_at
    ? new Date(invitation.sent_at).toLocaleDateString()
    : new Date(invitation.created_at).toLocaleDateString();

  return (
    <div className="rounded-sm border border-dashed border-border bg-soft-white px-4 py-3">
      <p className="font-medium text-graphite">{invitation.invited_email}</p>
      <p className="mt-1 text-xs text-graphite/55">
        Status: {formatStatus(invitation.status)} · Sent {sent}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onResend}
          disabled={disabled}
          className="text-sm text-emerald hover:underline disabled:opacity-50"
        >
          Resend invitation
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={disabled}
          className="text-sm text-red-700 hover:underline disabled:opacity-50"
        >
          Cancel invitation
        </button>
      </div>
    </div>
  );
}
