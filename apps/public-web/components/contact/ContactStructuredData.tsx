import { SITE_EMAIL, SITE_NAME } from "@/lib/utils";

export function ContactStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact ${SITE_NAME}`,
    description: "Contact and support for academic conferences, publications, and verification.",
    mainEntity: {
      "@type": "Organization",
      name: SITE_NAME,
      email: SITE_EMAIL,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: SITE_EMAIL,
        availableLanguage: ["English"],
      },
    },
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
