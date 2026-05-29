import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { resolveMediaUrl } from "@/lib/media";
import type { AboutGalleryItem } from "@/lib/about-api";
import { cn } from "@/lib/utils";

const toneClass: Record<string, string> = {
  emerald: "from-emerald/30 via-emerald/10 to-ivory",
  gold: "from-gold/25 via-ivory to-emerald/10",
  ivory: "from-ivory via-soft-white to-gold/15",
};

export function AboutGallery({ sectionTitle, items }: { sectionTitle: string; items: AboutGalleryItem[] }) {
  return (
    <section className="border-b border-border bg-ivory py-16 lg:py-20">
      <Container>
        <SectionHeader title={sectionTitle} align="center" className="mx-auto" />
        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {items.map((item, i) => {
            const image = resolveMediaUrl(item.image_url);
            return (
              <figure
                key={`${item.caption}-${i}`}
                className={cn("mb-4 break-inside-avoid overflow-hidden rounded-lg border border-border", i % 3 === 1 && "lg:mt-8")}
              >
                <div
                  className={cn(
                    "relative flex min-h-[180px] items-end p-5",
                    !image && `bg-gradient-to-br ${toneClass[item.tone ?? "emerald"] ?? toneClass.emerald}`
                  )}
                >
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  ) : null}
                  <div className={cn("relative", image && "bg-emerald-dark/70 px-3 py-2 text-ivory")}>
                    <figcaption className="font-serif text-lg">{item.caption}</figcaption>
                  </div>
                </div>
              </figure>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
