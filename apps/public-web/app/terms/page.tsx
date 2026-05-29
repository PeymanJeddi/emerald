import { MarkdownContent } from "@/components/cms/MarkdownContent";
import { AcademicCard } from "@/components/ui/AcademicCard";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fetchCmsPage } from "@/lib/cms-api";
import { SITE_NAME } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using Emerald Scholars Congress.",
};

const DEFAULT_MARKDOWN = `## 1. Acceptance of Terms

By accessing or using **${SITE_NAME}** ("the Platform"), you agree to these Terms and Conditions. If you do not agree, please do not use the Platform.

## 2. Eligibility

The Platform is intended for researchers, academics, and institutional participants. You must provide accurate registration information and maintain the confidentiality of your account credentials.

## 3. Submissions and Content

You retain ownership of scholarly materials you submit. By uploading content, you grant the Platform a limited license to store, display, and process submissions solely for conference administration, review workflows, and related academic services.

You represent that your submissions do not infringe third-party rights and comply with applicable academic integrity standards.

## 4. Certificates and Verification

Certificates issued through the Platform reflect participation records as documented by event organizers. Verification results are provided for informational purposes and do not constitute legal advice or official government endorsement.

## 5. Payments

Where fees apply, payment terms are disclosed at checkout. Refund policies, if any, are determined by the relevant event organizer and applicable regulations.

## 6. Acceptable Use

You agree not to misuse the Platform, including attempts to access unauthorized data, distribute malware, impersonate others, or interfere with system integrity.

## 7. Privacy

Personal data is processed in accordance with our privacy practices and applicable data protection laws. Contact details published on the Contact page apply to privacy-related inquiries.

## 8. Limitation of Liability

The Platform is provided on an "as is" basis. To the fullest extent permitted by law, ${SITE_NAME} is not liable for indirect, incidental, or consequential damages arising from use of the Platform.

## 9. Changes

We may update these Terms from time to time. Material changes will be reflected on this page with an updated effective date.

## 10. Contact

For questions regarding these Terms, please use the [Contact](/contact) page.
`;

export default async function TermsPage() {
  const content = await fetchCmsPage("terms");
  const heading = content?.heading ?? "Terms & Conditions";
  const markdown =
    (typeof content?.body_markdown === "string" && content.body_markdown.trim()) ||
    DEFAULT_MARKDOWN;
  const updatedAt =
    typeof content?.updated_at === "string" ? content.updated_at : null;

  return (
    <Container className="py-12 lg:py-16">
      <SectionHeader
        title={heading}
        subtitle="Please read these terms carefully before using our services."
      />
      {updatedAt ? (
        <p className="mb-6 text-sm text-graphite/55">
          Last updated: {updatedAt}
        </p>
      ) : null}
      <AcademicCard className="max-w-3xl border-emerald/20">
        <MarkdownContent content={markdown} />
      </AcademicCard>
    </Container>
  );
}
