import Link from "next/link";
import { AcademicCard } from "@/components/ui/AcademicCard";
import { CertificateStatus } from "./CertificateStatus";
import { SITE_NAME } from "@/lib/utils";
import type { Certificate } from "@/lib/types";

interface CertificateCardProps {
  certificate: Certificate;
  verifiedAt: string;
}

export function CertificateCard({
  certificate,
  verifiedAt,
}: CertificateCardProps) {
  return (
    <AcademicCard className="print-friendly border-2 border-emerald/30 bg-ivory">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-gold/30 pb-4">
        <div className="min-w-0">
          <p className="font-serif text-lg leading-tight text-emerald sm:text-xl">{SITE_NAME}</p>
          <p className="mt-1 text-xs text-graphite/60">Official certificate record</p>
        </div>
        <div
          className="flex h-14 w-14 items-center justify-center border border-gold/50 bg-emerald"
          aria-hidden
        >
          <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none">
            <path
              d="M16 3L28 9V23L16 29L4 23V9L16 3Z"
              stroke="#B89B5E"
              strokeWidth="0.75"
              fill="#145C50"
            />
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
        <div className="flex-1 space-y-5">
          <p className="text-sm leading-relaxed text-graphite/80">
            {certificate.verificationMessage}
          </p>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-widest text-graphite/60">
                Verification status
              </dt>
              <dd className="mt-1">
                <CertificateStatus status={certificate.status} />
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-widest text-graphite/60">
                Certificate code
              </dt>
              <dd className="mt-1 font-mono text-sm text-emerald">{certificate.code}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-widest text-graphite/60">
                Holder name
              </dt>
              <dd className="mt-1 font-serif text-xl text-emerald">
                {certificate.holderName}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-widest text-graphite/60">
                Event title
              </dt>
              <dd className="mt-1 text-sm text-graphite/80">{certificate.eventTitle}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-widest text-graphite/60">
                Event date
              </dt>
              <dd className="mt-1 text-sm text-graphite/80">{certificate.eventDate}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-widest text-graphite/60">
                Location
              </dt>
              <dd className="mt-1 text-sm text-graphite/80">{certificate.location}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-widest text-graphite/60">
                Format
              </dt>
              <dd className="mt-1 text-sm text-graphite/80">{certificate.format}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-widest text-graphite/60">
                Role
              </dt>
              <dd className="mt-1 text-sm text-graphite/80">{certificate.role}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-widest text-graphite/60">
                Presentation / participation title
              </dt>
              <dd className="mt-1 text-sm text-graphite/80">
                {certificate.presentationTitle}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-widest text-graphite/60">
                Record type
              </dt>
              <dd className="mt-1 text-sm text-graphite/80">{certificate.recordType}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-widest text-graphite/60">
                Issue date
              </dt>
              <dd className="mt-1 text-sm text-graphite/80">{certificate.issueDate}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-widest text-graphite/60">
                Verification timestamp
              </dt>
              <dd className="mt-1 text-sm text-graphite/80">{verifiedAt}</dd>
            </div>
            {certificate.eventSlug ? (
              <div>
                <dt className="text-xs font-medium uppercase tracking-widest text-graphite/60">
                  Related event reference
                </dt>
                <dd className="mt-1">
                  <Link
                    href={`/conferences/${certificate.eventSlug}`}
                    className="font-mono text-sm text-emerald-accent hover:underline"
                  >
                    {certificate.eventReferenceCode}
                  </Link>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>

        <div
          className="flex h-40 w-40 shrink-0 flex-col items-center justify-center self-start border-2 border-dashed border-gold/40 bg-soft-white text-center text-xs text-graphite/50 lg:h-48 lg:w-48"
          aria-label="QR code placeholder"
        >
          <span className="mb-1 text-[10px] uppercase tracking-widest text-gold">Seal</span>
          QR Placeholder
        </div>
      </div>
    </AcademicCard>
  );
}
