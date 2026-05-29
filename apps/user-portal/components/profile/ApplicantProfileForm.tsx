"use client";

import { FormEvent, useCallback, useState } from "react";
import { updateProfile, uploadIdentityDocument } from "@/lib/profile-api";
import type { ApplicantProfile, ProfileUpdatePayload } from "@/lib/profile-types";

const inputClass =
  "mt-1 w-full rounded-sm border border-border bg-soft-white px-4 py-2.5 text-sm focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald";

const ACADEMIC_STATUSES = ["Student", "Graduate", "Researcher", "Professor", "Professional"];
const DEGREES = ["Bachelor", "Master", "PhD", "Postdoc", "Other"];
const AFFILIATION_TYPES = ["Education", "Employment", "Research", "Independent"];
const DOC_TYPES = ["Passport", "National ID Card", "Birth Certificate", "Residence Permit", "Other Government-Issued ID"];

interface Props {
  profile: ApplicantProfile;
  onUpdated: (p: ApplicantProfile) => void;
}

function section<T extends Record<string, unknown>>(profile: ApplicantProfile, key: string): T {
  return (profile.profile[key] || {}) as T;
}

export function ApplicantProfileForm({ profile, onUpdated }: Props) {
  const [active, setActive] = useState("personal");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const personal = section<Record<string, string>>(profile, "personal");
  const contact = section<Record<string, string>>(profile, "contact");
  const academic = section<Record<string, string>>(profile, "academic");
  const affiliation = section<Record<string, string>>(profile, "affiliation");
  const researcher = section<Record<string, string>>(profile, "researcher");
  const identity = section<Record<string, string>>(profile, "identity");
  const consents = section<Record<string, boolean>>(profile, "consents");

  const save = useCallback(
    async (payload: ProfileUpdatePayload) => {
      setSaving(true);
      setError(null);
      setMessage(null);
      try {
        const updated = await updateProfile(payload);
        onUpdated(updated);
        setMessage("Profile saved.");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Save failed");
      } finally {
        setSaving(false);
      }
    },
    [onUpdated]
  );

  async function handlePersonal(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await save({
      personal: {
        first_name: fd.get("first_name"),
        middle_name: fd.get("middle_name") || null,
        last_name: fd.get("last_name"),
        country_of_residence: fd.get("country_of_residence"),
        city: fd.get("city") || null,
        nationality: fd.get("nationality") || null,
      },
    });
  }

  async function handleContact(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await save({
      contact: {
        primary_email: profile.email,
        backup_email: fd.get("backup_email"),
        phone_number: fd.get("phone_number") || null,
        whatsapp_number: fd.get("whatsapp_number") || null,
        preferred_language: fd.get("preferred_language") || "English",
      },
    });
  }

  async function handleAcademic(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await save({
      academic: {
        current_academic_status: fd.get("current_academic_status"),
        highest_degree: fd.get("highest_degree"),
        field_of_study: fd.get("field_of_study"),
        university_name: fd.get("university_name"),
        department: fd.get("department") || null,
        institution_country: fd.get("institution_country"),
        institution_city: fd.get("institution_city") || null,
        academic_email: fd.get("academic_email") || null,
      },
    });
  }

  async function handleAffiliation(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await save({
      affiliation: {
        primary_affiliation: fd.get("organization_name"),
        affiliation_type: fd.get("affiliation_type"),
        organization_name: fd.get("organization_name"),
        organization_country: fd.get("organization_country"),
        organization_city: fd.get("organization_city") || null,
        position_role: fd.get("position_role") || null,
      },
    });
  }

  async function handleResearcher(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const interests = String(fd.get("research_interests") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    await save({
      researcher: {
        orcid_id: fd.get("orcid_id") || null,
        google_scholar_url: fd.get("google_scholar_url") || null,
        semantic_scholar_id: fd.get("semantic_scholar_id") || null,
        dblp_url: fd.get("dblp_url") || null,
        openreview_id: fd.get("openreview_id") || null,
        personal_website: fd.get("personal_website") || null,
        linkedin_url: fd.get("linkedin_url") || null,
      },
      research_interests: interests,
    });
  }

  async function handleIdentity(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const front = fd.get("front") as File | null;
    if (front && front.size > 0) {
      setSaving(true);
      setError(null);
      try {
        const form = new FormData();
        form.append("document_type", String(fd.get("document_type")));
        form.append("document_number", String(fd.get("document_number")));
        form.append("issuing_country", String(fd.get("issuing_country")));
        form.append("front", front);
        const back = fd.get("back") as File | null;
        if (back && back.size > 0) form.append("back", back);
        const updated = await uploadIdentityDocument(form);
        onUpdated(updated);
        setMessage("Identity document uploaded.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setSaving(false);
      }
      return;
    }
    await save({
      identity: {
        document_type: fd.get("document_type"),
        document_number: fd.get("document_number"),
        issuing_country: fd.get("issuing_country"),
        expiry_date: fd.get("expiry_date") || null,
      },
    });
  }

  async function handleConsents(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await save({
      consents: {
        terms_accepted: fd.get("terms_accepted") === "on",
        privacy_accepted: fd.get("privacy_accepted") === "on",
        verification_consent: fd.get("verification_consent") === "on",
        academic_integrity: fd.get("academic_integrity") === "on",
        data_processing: fd.get("data_processing") === "on",
      },
    });
  }

  const tabs = [
    { id: "personal", label: "Personal" },
    { id: "contact", label: "Contact" },
    { id: "academic", label: "Academic" },
    { id: "affiliation", label: "Affiliation" },
    { id: "researcher", label: "Researcher" },
    { id: "identity", label: "Identity" },
    { id: "consents", label: "Consents" },
  ];

  return (
    <div>
      {message && (
        <p className="mb-4 rounded-sm border border-emerald/30 bg-emerald/5 px-4 py-2 text-sm text-emerald" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-sm border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}

      <div id="required" className="mb-6 flex flex-wrap gap-2 border-b border-border pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={`rounded-sm px-3 py-1.5 text-sm ${
              active === t.id ? "bg-emerald text-ivory" : "text-graphite/70 hover:bg-border/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active === "personal" && (
        <form onSubmit={handlePersonal} className="archival-card space-y-4 rounded-sm p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">First name *</label>
              <input name="first_name" required defaultValue={personal.first_name || profile.first_name || ""} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium">Middle name</label>
              <input name="middle_name" defaultValue={personal.middle_name || profile.middle_name || ""} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium">Last name *</label>
              <input name="last_name" required defaultValue={personal.last_name || profile.last_name || ""} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium">Country of residence *</label>
              <input name="country_of_residence" required defaultValue={personal.country_of_residence || profile.country || ""} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium">City</label>
              <input name="city" defaultValue={personal.city || profile.city || ""} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium">Nationality</label>
              <input name="nationality" defaultValue={personal.nationality || ""} className={inputClass} />
            </div>
          </div>
          <button type="submit" disabled={saving} className="rounded-sm bg-emerald px-4 py-2 text-sm text-ivory disabled:opacity-50">
            Save personal
          </button>
        </form>
      )}

      {active === "contact" && (
        <form onSubmit={handleContact} className="archival-card space-y-4 rounded-sm p-6">
          <div>
            <label className="text-sm font-medium">Primary email</label>
            <input readOnly value={profile.email} className={`${inputClass} bg-border/20`} />
          </div>
          <div>
            <label className="text-sm font-medium">Backup email *</label>
            <input name="backup_email" type="email" required defaultValue={contact.backup_email || ""} className={inputClass} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Phone</label>
              <input name="phone_number" defaultValue={contact.phone_number || ""} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium">WhatsApp</label>
              <input name="whatsapp_number" defaultValue={contact.whatsapp_number || ""} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Preferred language</label>
            <input name="preferred_language" defaultValue={contact.preferred_language || "English"} className={inputClass} />
          </div>
          <button type="submit" disabled={saving} className="rounded-sm bg-emerald px-4 py-2 text-sm text-ivory disabled:opacity-50">
            Save contact
          </button>
        </form>
      )}

      {active === "academic" && (
        <form onSubmit={handleAcademic} className="archival-card space-y-4 rounded-sm p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Academic status *</label>
              <select name="current_academic_status" required defaultValue={academic.current_academic_status || ""} className={inputClass}>
                <option value="">Select</option>
                {ACADEMIC_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Highest degree *</label>
              <select name="highest_degree" required defaultValue={academic.highest_degree || ""} className={inputClass}>
                <option value="">Select</option>
                {DEGREES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium">Field of study *</label>
              <input name="field_of_study" required defaultValue={academic.field_of_study || ""} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium">University / institution *</label>
              <input name="university_name" required defaultValue={academic.university_name || profile.affiliation || ""} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium">Department</label>
              <input name="department" defaultValue={academic.department || profile.department || ""} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium">Institution country *</label>
              <input name="institution_country" required defaultValue={academic.institution_country || ""} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium">Institution city</label>
              <input name="institution_city" defaultValue={academic.institution_city || ""} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium">Academic email</label>
              <input name="academic_email" type="email" defaultValue={academic.academic_email || ""} className={inputClass} />
            </div>
          </div>
          <button type="submit" disabled={saving} className="rounded-sm bg-emerald px-4 py-2 text-sm text-ivory disabled:opacity-50">
            Save academic
          </button>
        </form>
      )}

      {active === "affiliation" && (
        <form onSubmit={handleAffiliation} className="archival-card space-y-4 rounded-sm p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Affiliation type *</label>
              <select name="affiliation_type" required defaultValue={affiliation.affiliation_type || ""} className={inputClass}>
                <option value="">Select</option>
                {AFFILIATION_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Organization name *</label>
              <input name="organization_name" required defaultValue={affiliation.organization_name || profile.affiliation || ""} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium">Organization country *</label>
              <input name="organization_country" required defaultValue={affiliation.organization_country || ""} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium">Organization city</label>
              <input name="organization_city" defaultValue={affiliation.organization_city || ""} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium">Position / role</label>
              <input name="position_role" defaultValue={affiliation.position_role || ""} className={inputClass} />
            </div>
          </div>
          <button type="submit" disabled={saving} className="rounded-sm bg-emerald px-4 py-2 text-sm text-ivory disabled:opacity-50">
            Save affiliation
          </button>
        </form>
      )}

      {active === "researcher" && (
        <form onSubmit={handleResearcher} className="archival-card space-y-4 rounded-sm p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">ORCID iD</label>
              <input name="orcid_id" placeholder="0000-0000-0000-0000" defaultValue={researcher.orcid_id || ""} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium">Google Scholar URL</label>
              <input name="google_scholar_url" defaultValue={researcher.google_scholar_url || ""} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium">Semantic Scholar ID</label>
              <input name="semantic_scholar_id" defaultValue={researcher.semantic_scholar_id || ""} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium">DBLP URL</label>
              <input name="dblp_url" defaultValue={researcher.dblp_url || ""} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium">OpenReview ID</label>
              <input name="openreview_id" defaultValue={researcher.openreview_id || ""} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium">Personal website</label>
              <input name="personal_website" defaultValue={researcher.personal_website || ""} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium">LinkedIn URL</label>
              <input name="linkedin_url" defaultValue={researcher.linkedin_url || ""} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium">Research interests (comma-separated)</label>
              <input
                name="research_interests"
                defaultValue={
                  Array.isArray(profile.profile?.research_interests)
                    ? (profile.profile.research_interests as unknown as string[]).join(", ")
                    : ""
                }
                className={inputClass}
              />
            </div>
          </div>
          <button type="submit" disabled={saving} className="rounded-sm bg-emerald px-4 py-2 text-sm text-ivory disabled:opacity-50">
            Save researcher profile
          </button>
        </form>
      )}

      {active === "identity" && (
        <form onSubmit={handleIdentity} className="archival-card space-y-4 rounded-sm p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Document type *</label>
              <select name="document_type" required defaultValue={identity.document_type || ""} className={inputClass}>
                <option value="">Select</option>
                {DOC_TYPES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Document number *</label>
              <input name="document_number" required defaultValue={identity.document_number || ""} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium">Issuing country *</label>
              <input name="issuing_country" required defaultValue={identity.issuing_country || ""} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium">Expiry date (passport)</label>
              <input name="expiry_date" type="date" defaultValue={identity.expiry_date || ""} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium">Front image *</label>
              <input name="front" type="file" accept="image/*,.pdf" className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium">Back image (if required)</label>
              <input name="back" type="file" accept="image/*,.pdf" className={inputClass} />
            </div>
          </div>
          {identity.front_image_url && (
            <p className="text-sm text-emerald">Document on file. Upload again to replace.</p>
          )}
          <button type="submit" disabled={saving} className="rounded-sm bg-emerald px-4 py-2 text-sm text-ivory disabled:opacity-50">
            Save identity
          </button>
        </form>
      )}

      {active === "consents" && (
        <form onSubmit={handleConsents} className="archival-card space-y-4 rounded-sm p-6">
          <label className="flex gap-2 text-sm">
            <input name="terms_accepted" type="checkbox" defaultChecked={!!consents.terms_accepted} />
            I accept the Terms & Conditions *
          </label>
          <label className="flex gap-2 text-sm">
            <input name="privacy_accepted" type="checkbox" defaultChecked={!!consents.privacy_accepted} />
            I accept the Privacy Policy *
          </label>
          <label className="flex gap-2 text-sm">
            <input name="verification_consent" type="checkbox" defaultChecked={!!consents.verification_consent} />
            I consent to document verification *
          </label>
          <label className="flex gap-2 text-sm">
            <input name="academic_integrity" type="checkbox" defaultChecked={!!consents.academic_integrity} />
            I confirm academic integrity *
          </label>
          <label className="flex gap-2 text-sm">
            <input name="data_processing" type="checkbox" defaultChecked={!!consents.data_processing} />
            I consent to data processing *
          </label>
          <p className="text-xs text-graphite/60">
            I confirm that all information and documents submitted by me are accurate, authentic, legally mine,
            and may be verified by the platform where legally permitted.
          </p>
          <button type="submit" disabled={saving} className="rounded-sm bg-emerald px-4 py-2 text-sm text-ivory disabled:opacity-50">
            Save consents
          </button>
        </form>
      )}
    </div>
  );
}
