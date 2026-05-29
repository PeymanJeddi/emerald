import { SITE_NAME } from "@/lib/utils";

export function AboutStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    description:
      "International academic conference platform for publications, verification, and global research collaboration.",
    url: "https://emeraldscholarscongress.org",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
