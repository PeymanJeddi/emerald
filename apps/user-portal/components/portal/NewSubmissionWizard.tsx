"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileUploadBox } from "./FileUploadBox";
import { SubmissionStepper } from "./SubmissionStepper";
import { AcademicCard } from "@/components/ui/AcademicCard";
import { Button } from "@/components/ui/Button";
import { conferences } from "@/lib/data/conferences";
import type {
  AttendanceFormat,
  ParticipationType,
} from "@/lib/portal/types";

const STEPS = [
  "Event Selection",
  "Personal Information",
  "Submission Details",
  "Document Upload",
  "Certificate Information",
  "Review & Confirmation",
];

const inputClass =
  "mt-1 w-full border border-border bg-white px-4 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy";

export interface SubmissionFormData {
  eventSlug: string;
  participationType: ParticipationType;
  attendanceFormat: AttendanceFormat;
  preferredCertificateName: string;
  fullName: string;
  email: string;
  country: string;
  city: string;
  affiliation: string;
  department: string;
  academicRole: string;
  orcid: string;
  website: string;
  submissionTitle: string;
  abstract: string;
  keywords: string;
  researchField: string;
  biography: string;
  coAuthors: string;
  presentationLanguage: string;
  presentedBefore: "Yes" | "No";
  certificateName: string;
  certificateRole: string;
  certificateTitle: string;
  issueFormat: string;
  additionalNotes: string;
}

const initialData: SubmissionFormData = {
  eventSlug: "",
  participationType: "Presenter",
  attendanceFormat: "Hybrid",
  preferredCertificateName: "",
  fullName: "",
  email: "",
  country: "",
  city: "",
  affiliation: "",
  department: "",
  academicRole: "",
  orcid: "",
  website: "",
  submissionTitle: "",
  abstract: "",
  keywords: "",
  researchField: "",
  biography: "",
  coAuthors: "",
  presentationLanguage: "English",
  presentedBefore: "No",
  certificateName: "",
  certificateRole: "Presenter",
  certificateTitle: "",
  issueFormat: "Digital Certificate with Verification Page",
  additionalNotes: "",
};

export function NewSubmissionWizard({
  defaultUser,
}: {
  defaultUser?: Partial<SubmissionFormData>;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<SubmissionFormData>({
    ...initialData,
    ...defaultUser,
  });
  const [submitted, setSubmitted] = useState(false);

  function update(field: keyof SubmissionFormData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleSubmit() {
    // TODO: POST /api/portal/submissions
    setSubmitted(true);
    router.push("/portal/submissions/ESC-SUB-2026-001");
  }

  if (submitted) {
    return (
      <AcademicCard className="text-center">
        <h2 className="font-serif text-xl text-navy">Your submission has been received.</h2>
        <p className="mt-3 text-sm text-gray-600">Redirecting to submission details…</p>
      </AcademicCard>
    );
  }

  const selectedEvent = conferences.find((c) => c.slug === data.eventSlug);

  return (
    <AcademicCard>
      <SubmissionStepper steps={STEPS} currentStep={step} />

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="eventSlug" className="block text-sm font-medium text-navy">
              Select conference / event
            </label>
            <select
              id="eventSlug"
              value={data.eventSlug}
              onChange={(e) => update("eventSlug", e.target.value)}
              className={inputClass}
              required
            >
              <option value="">Select event</option>
              {conferences.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="participationType" className="block text-sm font-medium text-navy">
              Participation type
            </label>
            <select
              id="participationType"
              value={data.participationType}
              onChange={(e) =>
                update("participationType", e.target.value as ParticipationType)
              }
              className={inputClass}
            >
              <option value="Presenter">Presenter</option>
              <option value="Participant">Participant</option>
              <option value="Author">Author</option>
              <option value="Workshop Participant">Workshop Participant</option>
            </select>
          </div>
          <div>
            <label htmlFor="attendanceFormat" className="block text-sm font-medium text-navy">
              Attendance format
            </label>
            <select
              id="attendanceFormat"
              value={data.attendanceFormat}
              onChange={(e) =>
                update("attendanceFormat", e.target.value as AttendanceFormat)
              }
              className={inputClass}
            >
              <option value="Online">Online</option>
              <option value="In-person">In-person</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label htmlFor="preferredCertificateName" className="block text-sm font-medium text-navy">
              Preferred certificate name
            </label>
            <input
              id="preferredCertificateName"
              value={data.preferredCertificateName}
              onChange={(e) => update("preferredCertificateName", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["fullName", "Full legal name"],
              ["email", "Email address"],
              ["country", "Country / Region"],
              ["city", "City"],
              ["affiliation", "Affiliation / Institution"],
              ["department", "Department"],
              ["academicRole", "Academic or professional role"],
              ["orcid", "ORCID / Research profile URL (optional)"],
              ["website", "Personal website (optional)"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className={key === "orcid" || key === "website" ? "sm:col-span-2" : ""}>
              <label htmlFor={key} className="block text-sm font-medium text-navy">
                {label}
              </label>
              <input
                id={key}
                type={key === "email" ? "email" : "text"}
                value={data[key]}
                onChange={(e) => update(key, e.target.value)}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy">Submission title</label>
            <input
              value={data.submissionTitle}
              onChange={(e) => update("submissionTitle", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy">Abstract</label>
            <textarea
              value={data.abstract}
              onChange={(e) => update("abstract", e.target.value)}
              rows={6}
              className={inputClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-navy">Keywords</label>
              <input
                value={data.keywords}
                onChange={(e) => update("keywords", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy">Research field</label>
              <input
                value={data.researchField}
                onChange={(e) => update("researchField", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy">Short biography</label>
            <textarea
              value={data.biography}
              onChange={(e) => update("biography", e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy">Co-authors (optional)</label>
            <input
              value={data.coAuthors}
              onChange={(e) => update("coAuthors", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-navy">Presentation language</label>
              <input
                value={data.presentationLanguage}
                onChange={(e) => update("presentationLanguage", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy">
                Has this work been presented before?
              </label>
              <select
                value={data.presentedBefore}
                onChange={(e) => update("presentedBefore", e.target.value as "Yes" | "No")}
                className={inputClass}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <FileUploadBox id="abstract-file" label="Upload abstract file" />
          <FileUploadBox id="full-paper" label="Upload full paper" optional />
          <FileUploadBox id="slides" label="Upload presentation slides" optional />
          <FileUploadBox id="identity-doc" label="Upload identity or affiliation document" optional />
          <FileUploadBox id="supporting" label="Upload supporting document" optional />
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy">Name to appear on certificate</label>
            <input
              value={data.certificateName}
              onChange={(e) => update("certificateName", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy">Certificate role</label>
            <input
              value={data.certificateRole}
              onChange={(e) => update("certificateRole", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy">
              Certificate title / participation title
            </label>
            <input
              value={data.certificateTitle}
              onChange={(e) => update("certificateTitle", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy">Preferred issue format</label>
            <select
              value={data.issueFormat}
              onChange={(e) => update("issueFormat", e.target.value)}
              className={inputClass}
            >
              <option value="Digital Certificate">Digital Certificate</option>
              <option value="Digital Certificate with Verification Page">
                Digital Certificate with Verification Page
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy">Additional notes (optional)</label>
            <textarea
              value={data.additionalNotes}
              onChange={(e) => update("additionalNotes", e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="space-y-6">
          <div className="border border-border bg-ivory p-4 text-sm text-gray-700">
            <h3 className="font-medium text-navy">Submission summary</h3>
            <dl className="mt-3 space-y-2">
              <div>
                <dt className="text-gray-500">Event</dt>
                <dd>{selectedEvent?.title ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Title</dt>
                <dd>{data.submissionTitle || "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Participation</dt>
                <dd>
                  {data.participationType} · {data.attendanceFormat}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Certificate name</dt>
                <dd>{data.certificateName || data.preferredCertificateName || "—"}</dd>
              </div>
            </dl>
          </div>
          <ul className="space-y-3 text-sm text-gray-700">
            <li>
              <label className="flex items-start gap-3">
                <input type="checkbox" required className="mt-1 h-4 w-4" />
                I confirm that the submitted information is accurate.
              </label>
            </li>
            <li>
              <label className="flex items-start gap-3">
                <input type="checkbox" required className="mt-1 h-4 w-4" />
                I confirm that submitted materials are original or authorized for submission.
              </label>
            </li>
            <li>
              <label className="flex items-start gap-3">
                <input type="checkbox" required className="mt-1 h-4 w-4" />
                I understand that records may be reviewed before certificate issuance.
              </label>
            </li>
          </ul>
        </div>
      )}

      <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-border pt-6">
        {step > 1 ? (
          <Button type="button" variant="secondary" onClick={back}>
            Previous
          </Button>
        ) : (
          <span />
        )}
        {step < STEPS.length ? (
          <Button type="button" onClick={next}>
            Continue
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit}>
            Submit for Review
          </Button>
        )}
      </div>
    </AcademicCard>
  );
}
