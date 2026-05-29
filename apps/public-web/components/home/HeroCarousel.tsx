"use client";

import { Button } from "@/components/ui/Button";
import type { HeroSlide } from "@/lib/hero-api";
import { resolveMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { PORTAL_REGISTER_URL } from "@/lib/portal-urls";

const APPLY_CTA = { label: "Apply Now", href: PORTAL_REGISTER_URL };

type HeroCarouselProps = {
  slides: HeroSlide[];
  fallback?: {
    title: string;
    subtitle: string;
    description?: string;
  };
};

function slideHref(slide: HeroSlide): string {
  if (!slide.cta_url) return APPLY_CTA.href;
  if (slide.cta_type === "external" && slide.cta_url.startsWith("http")) return slide.cta_url;
  return slide.cta_url.startsWith("/") ? slide.cta_url : `/${slide.cta_url}`;
}

export function HeroCarousel({ slides, fallback }: HeroCarouselProps) {
  const items =
    slides.length > 0
      ? slides
      : fallback
        ? [
            {
              id: "fallback",
              title: fallback.title,
              subtitle: fallback.subtitle,
              description: fallback.description ?? null,
              background_image_url: null,
              cta_label: APPLY_CTA.label,
              cta_url: APPLY_CTA.href,
              cta_type: "internal",
              display_priority: 0,
            } satisfies HeroSlide,
          ]
        : [];

  const [index, setIndex] = useState(0);
  const count = items.length;

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [count, next]);

  if (count === 0) return null;

  const slide = items[index];

  return (
    <section className="relative isolate min-h-[28rem] overflow-hidden border-b border-border bg-emerald-dark lg:min-h-[32rem]">
      {items.map((s, i) => {
        const image = resolveMediaUrl(s.background_image_url);
        return (
          <div
            key={s.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            )}
            aria-hidden={i !== index}
          >
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="" className="h-full w-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-emerald-dark via-emerald to-emerald-accent" />
            )}
            <div className="absolute inset-0 bg-emerald-dark/70" />
          </div>
        );
      })}

      <div className="relative z-10 mx-auto flex min-h-[28rem] max-w-6xl flex-col justify-center px-4 py-16 lg:min-h-[32rem] lg:px-8 lg:py-20">
        <div className="max-w-3xl text-ivory">
          {slide.subtitle ? (
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold">{slide.subtitle}</p>
          ) : null}
          <h1 className="mt-3 font-serif text-3xl font-medium leading-tight sm:text-4xl lg:text-5xl">
            {slide.title}
          </h1>
          {slide.description ? (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ivory/90 sm:text-lg">
              {slide.description}
            </p>
          ) : null}
          <div className="gold-divider mt-8 max-w-md" aria-hidden />
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {slide.cta_label && slide.cta_url ? (
              <Button
                href={slideHref(slide)}
                variant="secondary"
                className="min-w-[10rem] px-8 py-3 text-base font-semibold shadow-lg"
              >
                {slide.cta_label}
              </Button>
            ) : null}
            <Button
              href={APPLY_CTA.href}
              variant="ghost"
              className="border-ivory/40 text-ivory hover:bg-ivory/10"
            >
              {APPLY_CTA.label}
            </Button>
          </div>
        </div>
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-sm border border-ivory/30 bg-emerald-dark/60 px-3 py-2 text-ivory backdrop-blur hover:bg-emerald-dark/80 lg:left-6"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-sm border border-ivory/30 bg-emerald-dark/60 px-3 py-2 text-ivory backdrop-blur hover:bg-emerald-dark/80 lg:right-6"
            aria-label="Next slide"
          >
            ›
          </button>
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {items.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  i === index ? "bg-gold" : "bg-ivory/40 hover:bg-ivory/70"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}

      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-ivory/15 bg-emerald-dark/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-8">
          <p className="text-sm text-ivory/85">Ready to join the conference?</p>
          <Link
            href={APPLY_CTA.href}
            className="inline-flex items-center justify-center rounded-sm bg-gold px-5 py-2 text-sm font-semibold text-emerald-dark transition-colors hover:bg-gold/90"
          >
            {APPLY_CTA.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
