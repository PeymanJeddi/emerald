"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Testimonial } from "@/lib/testimonials-api";
import { resolveMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";

const DESKTOP_VISIBLE = 3;
const TABLET_VISIBLE = 2;
const MOBILE_VISIBLE = 1;

interface TestimonialsCarouselProps {
  title: string;
  subtitle: string;
  items: Testimonial[];
}

function TestimonialCard({ item }: { item: Testimonial }) {
  const avatar = resolveMediaUrl(item.profile_image_url);

  return (
    <blockquote className="archival-card flex h-full min-h-[280px] flex-col rounded-sm border-emerald/15 p-6 text-left sm:min-h-[300px]">
      {item.rating ? (
        <p className="mb-3 text-gold" aria-label={`${item.rating} out of 5 stars`}>
          {"★".repeat(item.rating)}
          <span className="sr-only">{item.rating} stars</span>
        </p>
      ) : null}
      <p className="line-clamp-6 flex-1 text-sm leading-relaxed text-graphite/85 sm:text-[0.95rem]">
        &ldquo;{item.testimonial_text}&rdquo;
      </p>
      <footer className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatar}
            alt=""
            className="h-11 w-11 shrink-0 rounded-full border border-gold/30 object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald/10 font-serif text-lg text-emerald">
            {item.full_name.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <cite className="not-italic text-sm font-medium text-emerald">{item.full_name}</cite>
          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-graphite/65">
            {[item.position_title, item.institution, item.country].filter(Boolean).join(" · ")}
          </p>
        </div>
      </footer>
    </blockquote>
  );
}

export function TestimonialsCarousel({ title, subtitle, items }: TestimonialsCarouselProps) {
  const slides = items;
  const count = slides.length;
  const [pageIndex, setPageIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(DESKTOP_VISIBLE);

  useEffect(() => {
    const updateVisible = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setVisibleCount(DESKTOP_VISIBLE);
      } else if (window.matchMedia("(min-width: 640px)").matches) {
        setVisibleCount(TABLET_VISIBLE);
      } else {
        setVisibleCount(MOBILE_VISIBLE);
      }
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  const pageCount = Math.max(1, Math.ceil(count / visibleCount));

  useEffect(() => {
    setPageIndex((i) => Math.min(i, pageCount - 1));
  }, [pageCount]);

  const visibleSlides = useMemo(() => {
    if (count === 0) return [];
    const start = pageIndex * visibleCount;
    const chunk: Testimonial[] = [];
    for (let i = 0; i < visibleCount; i += 1) {
      chunk.push(slides[(start + i) % count]);
    }
    return chunk;
  }, [count, pageIndex, slides, visibleCount]);

  const goNext = useCallback(() => {
    if (pageCount <= 1) return;
    setPageIndex((i) => (i + 1) % pageCount);
  }, [pageCount]);

  const goPrev = useCallback(() => {
    if (pageCount <= 1) return;
    setPageIndex((i) => (i - 1 + pageCount) % pageCount);
  }, [pageCount]);

  useEffect(() => {
    if (pageCount <= 1) return;
    const timer = setInterval(goNext, 8000);
    return () => clearInterval(timer);
  }, [goNext, pageCount]);

  if (count === 0) return null;

  const showControls = pageCount > 1;

  return (
    <section className="border-b border-border bg-ivory py-16 lg:py-20">
      <Container>
        <SectionHeader title={title} description={subtitle} align="center" className="mx-auto" />

        <div className="mx-auto mt-12 max-w-6xl">
          {showControls ? (
            <div className="mb-6 flex items-center justify-end gap-2 sm:justify-between">
              <p className="hidden text-sm text-graphite/55 sm:block">
                Showing {visibleSlides.length} of {count} testimonials
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  className="flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-soft-white text-lg text-emerald shadow-sm transition-colors hover:border-emerald/40 hover:bg-ivory"
                  aria-label="Previous testimonials"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-soft-white text-lg text-emerald shadow-sm transition-colors hover:border-emerald/40 hover:bg-ivory"
                  aria-label="Next testimonials"
                >
                  ›
                </button>
              </div>
            </div>
          ) : null}

          <div
            className={cn(
              "grid gap-6",
              visibleCount === 3 && "lg:grid-cols-3",
              visibleCount === 2 && "sm:grid-cols-2",
              visibleCount === 1 && "grid-cols-1"
            )}
          >
            {visibleSlides.map((item) => (
              <TestimonialCard key={`${pageIndex}-${item.id}`} item={item} />
            ))}
          </div>

          {showControls ? (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPageIndex(i)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === pageIndex ? "w-6 bg-emerald" : "w-2 bg-border hover:bg-emerald/40"
                  )}
                  aria-label={`Go to slide group ${i + 1}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
