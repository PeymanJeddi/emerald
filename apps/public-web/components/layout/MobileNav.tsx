"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  id: string;
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  pathname: string;
}

export function MobileNav({
  id,
  open,
  onClose,
  links,
  pathname,
}: MobileNavProps) {
  if (!open) return null;

  return (
    <nav
      id={id}
      className="border-t border-border bg-soft-white lg:hidden"
      aria-label="Mobile navigation"
    >
      <ul className="divide-y divide-border">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onClose}
              className={cn(
                "block px-4 py-3 text-sm",
                pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href))
                  ? "bg-ivory font-medium text-emerald"
                  : "text-graphite/80 hover:bg-ivory"
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
