import { CertificateCard } from "@/components/certificate/CertificateCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fetchCertificateByCode } from "@/lib/certificate-api";
import { formatVerificationTimestamp, normalizeCertificateCode } from "@/lib/utils";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const normalized = normalizeCertificateCode(decodeURIComponent(code));
  const result = await fetchCertificateByCode(normalized);
  if ("error" in result) {
    return { title: "Certificate Not Found" };
  }
  return {
    title: `Certificate ${result.certificate.code}`,
    description: "Certificate verification result",
  };
}

export default async function VerifyResultPage({ params }: PageProps) {
  const { code } = await params;
  const normalized = normalizeCertificateCode(decodeURIComponent(code));
  const result = await fetchCertificateByCode(normalized);

  if ("error" in result) {
    const isSubmissionCode = normalized.startsWith("ESC-SUB-");

    let title = "Certificate Not Found";
    let message =
      result.error ||
      "No public certificate record was found for the provided verification code.";

    if (result.revoked) {
      title = "Certificate Revoked";
    } else if (result.notIssued) {
      title = "Certificate Not Yet Issued";
      message =
        "This submission exists, but a certificate has not been issued yet. An administrator must set the submission status to Certificate Issued before it can be verified publicly.";
    } else if (isSubmissionCode) {
      message =
        "No issued certificate was found for this submission code. Ask your administrator to set the submission status to Certificate Issued, then try again.";
    }

    return (
      <Container className="py-12 lg:py-16">
        <EmptyState title={title} message={message} />
      </Container>
    );
  }

  const verifiedAt = formatVerificationTimestamp();

  return (
    <Container className="py-12 lg:py-16">
      <SectionHeader
        eyebrow="Verification Result"
        title="Certificate Verification"
        description={`Verification result for certificate ${result.certificate.code}.`}
      />
      <CertificateCard certificate={result.certificate} verifiedAt={verifiedAt} />
    </Container>
  );
}
