import { ContactPageView } from "@/components/contact/ContactPageView";
import { ContactStructuredData } from "@/components/contact/ContactStructuredData";
import { fetchContact } from "@/lib/contact-api";
import { SITE_NAME } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const contact = await fetchContact();
  const title = contact?.seo?.title ?? `Contact Us | ${SITE_NAME}`;
  const description =
    contact?.seo?.description ??
    "Contact Emerald Scholars Congress for conference support, publications, verification, and partnerships.";
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function ContactPage() {
  const content = await fetchContact();

  if (!content) {
    return (
      <div className="py-20 text-center text-graphite/70">
        <p>Contact page content is unavailable. Please ensure the API is running and seed has been applied.</p>
      </div>
    );
  }

  return (
    <>
      <ContactStructuredData />
      <ContactPageView content={content} />
    </>
  );
}
