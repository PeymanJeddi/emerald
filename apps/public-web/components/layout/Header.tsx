"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { MobileNav } from "./MobileNav";
import { PORTAL_LOGIN_URL } from "@/lib/portal-urls";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/conferences", label: "Conferences" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: PORTAL_LOGIN_URL, label: "Portal Sign In" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-border bg-ivory">
      <Container>
        <div className="flex items-center justify-between py-4">
          <Logo showSubtitle className="max-w-[75%] sm:max-w-none" />

          <nav
            className="hidden items-center gap-6 lg:flex"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm transition-colors hover:text-emerald-accent",
                  pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href))
                    ? "font-medium text-emerald"
                    : "text-graphite/80"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center border border-border bg-soft-white text-emerald lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="sr-only">Menu</span>
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
          </button>
        </div>
      </Container>

      <MobileNav
        id="mobile-nav"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={navLinks}
        pathname={pathname}
      />
    </header>
  );
}
