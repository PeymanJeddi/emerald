"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { AboutStat } from "@/lib/about-api";
import { useEffect, useRef, useState } from "react";

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1200;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setDisplay(Math.floor(progress * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="font-serif text-4xl font-medium text-ivory sm:text-5xl">
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function AboutStatsSection({
  sectionTitle,
  items,
}: {
  sectionTitle: string;
  items: AboutStat[];
}) {
  return (
    <section className="border-b border-emerald-dark/20 bg-emerald-dark py-16 text-ivory lg:py-20">
      <Container>
        <SectionHeader
          title={sectionTitle}
          align="center"
          className="mx-auto [&_h2]:text-ivory [&_.gold-divider]:border-gold/50"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item) => (
            <div
              key={item.label}
              className="rounded-sm border border-ivory/10 bg-emerald/40 p-6 text-center backdrop-blur-sm"
            >
              <AnimatedNumber value={item.value} suffix={item.suffix} />
              <p className="mt-3 text-xs uppercase tracking-widest text-ivory/75">{item.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
