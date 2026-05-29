import { MarkdownContent } from "@/components/cms/MarkdownContent";
import { AcademicCard } from "@/components/ui/AcademicCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { fetchCmsPage } from "@/lib/cms-api";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const TITLES: Record<string, string> = {
  "privacy-policy": "Privacy Policy",
  "academic-integrity": "Academic Integrity Policy",
  "publication-ethics": "Publication Ethics Policy",
  "refund-policy": "Refund Policy",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: TITLES[slug] ?? "Legal" };
}

export default async function LegalPage({ params }: PageProps) {
  const { slug } = await params;
  const content = await fetchCmsPage(slug);
  if (!content?.body_markdown) notFound();

  const heading = content.heading ?? TITLES[slug] ?? "Legal";

  return (
    <Container className="py-12 lg:py-16">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: heading }]} />
      <h1 className="mt-6 font-serif text-3xl text-emerald">{heading}</h1>
      {content.updated_at ? (
        <p className="mt-2 text-sm text-graphite/55">Last updated: {content.updated_at}</p>
      ) : null}
      <AcademicCard className="mt-8 max-w-3xl border-emerald/20">
        <MarkdownContent content={content.body_markdown} />
      </AcademicCard>
    </Container>
  );
}
