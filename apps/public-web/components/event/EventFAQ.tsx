"use client";

import { Container } from "@/components/ui/Container";
import type { EventFAQ as FAQItem } from "@/lib/event-detail-types";
import { useState } from "react";

export function EventFAQSection({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  if (!items.length) return null;

  return (
    <section className="border-t border-border bg-ivory py-12 lg:py-16">
      <Container>
        <h2 className="font-serif text-2xl text-emerald">Frequently Asked Questions</h2>
        <div className="mt-8 max-w-3xl space-y-2">
          {items.map((item, i) => (
            <div key={i} className="archival-card overflow-hidden rounded-sm border-emerald/15">
              <button
                type="button"
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-emerald"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                {item.question}
                <span className="text-gold">{open === i ? "−" : "+"}</span>
              </button>
              {open === i ? (
                <div className="border-t border-border px-5 py-4 text-sm leading-relaxed text-graphite/80">
                  {item.answer}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
