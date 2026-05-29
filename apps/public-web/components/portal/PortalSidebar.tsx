"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/portal", label: "Dashboard", exact: true },
  { href: "/portal/submissions", label: "My Submissions" },
  { href: "/portal/submissions/new", label: "New Submission" },
  { href: "/portal/certificates", label: "Certificates" },
  { href: "/portal/messages", label: "Messages" },
  { href: "/portal/profile", label: "Profile" },
  { href: "/portal/settings", label: "Settings" },
];

interface PortalSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function PortalSidebar({ open, onClose }: PortalSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const nav = (
    <nav className="flex flex-col gap-1 p-4" aria-label="Portal navigation">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClose}
          className={cn(
            "border-l-2 px-3 py-2.5 text-sm transition-colors",
            isActive(link.href, link.exact)
              ? "border-gold bg-white/5 font-medium text-ivory"
              : "border-transparent text-ivory/75 hover:border-gold/40 hover:bg-white/5 hover:text-ivory"
          )}
        >
          {link.label}
        </Link>
      ))}
      <button
        type="button"
        onClick={() => {
          logout();
          onClose();
          window.location.href = "/auth/login";
        }}
        className="mt-4 px-3 py-2.5 text-left text-sm text-ivory/75 hover:text-gold"
      >
        Sign Out
      </button>
    </nav>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-gold/20 bg-emerald-dark lg:flex">
        <div className="border-b border-gold/20 px-4 py-5">
          <Logo variant="light" showSubtitle href="/" />
          <p className="mt-2 text-xs text-ivory/50">Administration Portal</p>
        </div>
        {nav}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={onClose}
          />
          <aside className="relative flex h-full w-64 flex-col border-r border-gold/20 bg-emerald-dark shadow-xl">
            <div className="flex items-center justify-between border-b border-gold/20 px-4 py-4">
              <span className="font-serif text-sm text-ivory">Menu</span>
              <button
                type="button"
                onClick={onClose}
                className="text-ivory/80 hover:text-gold"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
