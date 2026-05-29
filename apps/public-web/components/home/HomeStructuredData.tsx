export function HomeStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Emerald Scholars Congress",
    url: "https://emeraldscholars.org",
    description:
      "International academic conference platform for submissions, verification, and publication pathways.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
