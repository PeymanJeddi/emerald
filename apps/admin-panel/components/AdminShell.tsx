"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { getToken } from "@/lib/api";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/users", label: "Users" },
  { href: "/events", label: "Events" },
  { href: "/submissions", label: "Submissions" },
  { href: "/certificates", label: "Certificates" },
  { href: "/payments", label: "Payments" },
  { href: "/cms", label: "CMS" },
  { href: "/audit-logs", label: "Audit Logs" },
  { href: "/settings", label: "Settings" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/login";

  useEffect(() => {
    if (!isLogin && !getToken()) router.replace("/login");
  }, [isLogin, router]);

  if (isLogin) return <>{children}</>;

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r border-border bg-emerald-dark p-4 text-ivory">
        <p className="font-serif text-lg">ESC Admin</p>
        <nav className="mt-8 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-sm px-3 py-2 text-sm",
                pathname.startsWith(item.href) ? "bg-emerald" : "text-ivory/70 hover:bg-emerald/50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem("esc_admin_token");
            router.push("/login");
          }}
          className="mt-8 text-xs text-ivory/60"
        >
          Sign out
        </button>
      </aside>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
