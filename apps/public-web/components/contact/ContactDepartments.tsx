"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ContactDepartment } from "@/lib/contact-api";
import { useState } from "react";

export function ContactDepartments({
  sectionTitle,
  items,
}: {
  sectionTitle: string;
  items: ContactDepartment[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-b border-border bg-ivory py-16 lg:py-20">
      <Container>
        <SectionHeader title={sectionTitle} align="center" className="mx-auto" />
        <div className="mx-auto mt-10 max-w-2xl space-y-2">
          {items.map((item, i) => (
            <div key={item.name} className="archival-card overflow-hidden rounded-sm border-emerald/15">
              <button
                type="button"
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-emerald"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                {item.name}
                <span className="text-gold">{open === i ? "−" : "+"}</span>
              </button>
              {open === i ? (
                <div className="border-t border-border px-5 py-4 text-sm text-graphite/80">{item.description}</div>
              ) : null}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
