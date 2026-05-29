"use client";

import { useState } from "react";
import { PortalAuthGuard } from "./PortalAuthGuard";
import { PortalHeader } from "./PortalHeader";
import { PortalSidebar } from "./PortalSidebar";

export function PortalShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <PortalAuthGuard>
      <div className="flex min-h-screen bg-ivory">
        <PortalSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <PortalHeader title={title} onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </PortalAuthGuard>
  );
}
