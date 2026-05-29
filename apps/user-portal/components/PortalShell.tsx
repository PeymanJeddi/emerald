"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { getToken } from "@/lib/api";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "My Profile" },
  { href: "/submissions", label: "My Applications" },
  { href: "/documents", label: "Documents" },
  { href: "/messages", label: "Messages" },
  { href: "/payments", label: "Payments" },
  { href: "/certificates", label: "Certificates" },
  { href: "/settings", label: "Settings" },
];

const publicPaths = ["/login", "/register", "/forgot-password"];

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (!isPublic && !getToken()) router.replace("/login");
  }, [isPublic, router]);

  if (isPublic) return <>{children}</>;

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r border-border bg-emerald-dark p-4 text-ivory">
        <p className="font-serif text-lg">ESC Portal</p>
        <nav className="mt-8 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-sm px-3 py-2 text-sm",
                pathname.startsWith(item.href) ? "bg-emerald text-ivory" : "text-ivory/70 hover:bg-emerald/50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem("esc_token");
            router.push("/login");
          }}
          className="mt-8 text-xs text-ivory/60 hover:text-ivory"
        >
          Sign out
        </button>
      </aside>
      <main className="flex-1 bg-ivory p-6 md:p-8">
        <div className="gold-divider mb-6 max-w-6xl" />
        {children}
      </main>
    </div>
  );
}
