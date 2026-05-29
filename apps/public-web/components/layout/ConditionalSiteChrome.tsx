"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { TopBar } from "./TopBar";

export function ConditionalSiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideChrome =
    pathname.startsWith("/auth") || pathname.startsWith("/portal");

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <TopBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
