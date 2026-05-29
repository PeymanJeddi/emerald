import { AboutPageView } from "@/components/about/AboutPageView";
import { AboutStructuredData } from "@/components/about/AboutStructuredData";
import { fetchAbout } from "@/lib/about-api";
import { fetchTestimonials } from "@/lib/testimonials-api";
import { SITE_NAME } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const about = await fetchAbout();
  const title = about?.seo?.title ?? `About Us | ${SITE_NAME}`;
  const description =
    about?.seo?.description ??
    "Learn about our international academic conference platform, integrity standards, and global research community.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function AboutPage() {
  const [content, testimonials] = await Promise.all([fetchAbout(), fetchTestimonials()]);

  if (!content) {
    return (
      <div className="py-20 text-center text-graphite/70">
        <p>About page content is loading. Please ensure the API is running and seed has been applied.</p>
      </div>
    );
  }

  return (
    <>
      <AboutStructuredData />
      <AboutPageView content={content} testimonials={testimonials} />
    </>
  );
}
