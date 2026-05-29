"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AcademicCard } from "@/components/ui/AcademicCard";
import { Button } from "@/components/ui/Button";
import { INQUIRY_TYPES, submitContactInquiry } from "@/lib/contact-api";

const inputClass =
  "mt-1 w-full border border-border bg-soft-white px-4 py-2.5 text-sm focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald";

interface ContactFormProps {
  title: string;
  subtitle?: string;
  supportNote?: string;
  privacyUrl?: string;
}

export function ContactForm({ title, subtitle, supportNote, privacyUrl = "/legal/privacy-policy" }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    if (!form.get("consent")) {
      setError("You must agree to the privacy policy to submit.");
      return;
    }

    setLoading(true);
    try {
      const result = await submitContactInquiry({
        full_name: String(form.get("fullName") ?? ""),
        email: String(form.get("email") ?? ""),
        institution: String(form.get("institution") ?? "") || undefined,
        country: String(form.get("country") ?? "") || undefined,
        inquiry_type: String(form.get("inquiryType") ?? ""),
        subject: String(form.get("subject") ?? ""),
        message: String(form.get("message") ?? ""),
        consent: true,
      });
      setSuccessMessage(result.message);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <AcademicCard className="border-emerald/20">
        <h2 className="font-serif text-xl text-emerald">Message received</h2>
        <p className="mt-3 text-sm leading-relaxed text-graphite/80">{successMessage}</p>
      </AcademicCard>
    );
  }

  return (
    <AcademicCard className="border-emerald/20">
      <h2 className="font-serif text-xl text-emerald">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm text-graphite/75">{subtitle}</p> : null}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-emerald">
              Full name
            </label>
            <input id="fullName" name="fullName" type="text" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-emerald">
              Email address
            </label>
            <input id="email" name="email" type="email" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="inquiryType" className="block text-sm font-medium text-emerald">
              Inquiry type
            </label>
            <select id="inquiryType" name="inquiryType" required className={inputClass}>
              {INQUIRY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="institution" className="block text-sm font-medium text-emerald">
              Institution <span className="text-graphite/50">(optional)</span>
            </label>
            <input id="institution" name="institution" type="text" className={inputClass} />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-emerald">
              Country <span className="text-graphite/50">(optional)</span>
            </label>
            <input id="country" name="country" type="text" className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="subject" className="block text-sm font-medium text-emerald">
              Subject
            </label>
            <input id="subject" name="subject" type="text" required className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="block text-sm font-medium text-emerald">
              Message
            </label>
            <textarea id="message" name="message" required rows={6} className={inputClass} />
          </div>
        </div>
        <label className="flex items-start gap-3 text-xs leading-relaxed text-graphite/70">
          <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 shrink-0" />
          I agree to the processing of my submitted information for communication and support purposes in
          accordance with the platform&apos;s{" "}
          <Link href={privacyUrl} className="text-emerald hover:underline">
            Privacy Policy
          </Link>
          .
        </label>
        {error ? (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
          {loading ? "Sending…" : "Send message"}
        </Button>
      </form>
    </AcademicCard>
  );
}

export function ContactFormSection({
  form,
}: {
  form: ContactFormProps & { support_note?: string };
}) {
  return (
    <section id="contact-form" className="scroll-mt-24 border-b border-border bg-soft-white py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ContactForm
              title={form.title}
              subtitle={form.subtitle}
              privacyUrl={form.privacyUrl}
            />
          </div>
          <div className="lg:col-span-2">
            <div className="sticky top-8 space-y-6">
              <div className="archival-card rounded-sm border-emerald/15 p-6">
                <h3 className="font-serif text-lg text-emerald">Before you write</h3>
                <p className="mt-3 text-sm leading-relaxed text-graphite/80">
                  {form.support_note ??
                    "Select the inquiry type that best matches your request so we can route your message to the right team."}
                </p>
              </div>
              <div className="rounded-sm border border-gold/30 bg-ivory p-6 text-sm text-graphite/75">
                <p className="font-medium text-emerald">Response times</p>
                <p className="mt-2">General inquiries: 1–2 business days</p>
                <p>Technical issues: within 24 hours</p>
                <p>Partnerships: 3–5 business days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
