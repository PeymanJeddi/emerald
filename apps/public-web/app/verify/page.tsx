import { VerifyForm } from "@/components/certificate/VerifyForm";
import { AcademicCard } from "@/components/ui/AcademicCard";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certificate Verification",
  description:
    "Enter a certificate verification code to validate an issued academic event certificate record.",
};

export default function VerifyPage() {
  return (
    <Container className="py-12 lg:py-16">
      <SectionHeader
        title="Certificate Verification"
        description="Enter a certificate verification code to validate an issued academic event certificate record. Certificate details are displayed only when a valid code is provided."
      />
      <AcademicCard className="max-w-2xl">
        <VerifyForm />
      </AcademicCard>
    </Container>
  );
}
