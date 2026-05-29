"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ContactFAQItem } from "@/lib/contact-api";
import { useState } from "react";

export function ContactFAQ({ sectionTitle, items }: { sectionTitle: string; items: ContactFAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-b border-border bg-ivory py-16 lg:py-20">
      <Container>
        <SectionHeader title={sectionTitle} align="center" className="mx-auto" />
        <div className="mx-auto mt-10 max-w-3xl space-y-2">
          {items.map((item, i) => (
            <div key={item.question} className="archival-card overflow-hidden rounded-sm border-emerald/15">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-emerald"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                {item.question}
                <span className="shrink-0 text-gold">{open === i ? "−" : "+"}</span>
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
