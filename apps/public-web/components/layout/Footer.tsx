import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { PORTAL_REGISTER_URL } from "@/lib/portal-urls";
import { SITE_EMAIL, SITE_NAME } from "@/lib/utils";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/conferences", label: "Conferences" },
  { href: "/verify", label: "Verify Certificate" },
  { href: PORTAL_REGISTER_URL, label: "Apply Now" },
];

const legalLinks = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/legal/privacy-policy", label: "Privacy Policy" },
  { href: "/legal/academic-integrity", label: "Academic Integrity" },
  { href: "/legal/publication-ethics", label: "Publication Ethics" },
  { href: "/legal/refund-policy", label: "Refund Policy" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gold/20 bg-emerald-dark text-ivory">
      <Container className="py-12">
        <div className="gold-divider mb-10" aria-hidden />
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo variant="light" showSubtitle />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/80">
              {SITE_NAME} is an international platform for academic conferences, scholarly submissions,
              verification, and publication pathways.
            </p>
            <p className="mt-4 text-sm">
              <a href={`mailto:${SITE_EMAIL}`} className="text-gold hover:underline">
                {SITE_EMAIL}
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-gold">Quick links</h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ivory/80 hover:text-ivory hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-gold">Legal</h3>
            <ul className="mt-4 space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ivory/80 hover:text-ivory hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="gold-divider mt-10 mb-6" aria-hidden />
        <p className="text-xs text-ivory/50">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
