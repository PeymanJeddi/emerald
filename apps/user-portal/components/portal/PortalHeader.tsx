"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

interface PortalHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function PortalHeader({ title, onMenuClick }: PortalHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="border-b border-border bg-ivory px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center border border-border bg-soft-white text-emerald lg:hidden"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <h1 className="font-serif text-xl font-medium text-emerald sm:text-2xl">{title}</h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="hidden text-graphite/70 hover:text-emerald sm:inline">
            Public site
          </Link>
          <span className="text-graphite/80">{user?.displayName ?? "Portal User"}</span>
        </div>
      </div>
    </header>
  );
}
