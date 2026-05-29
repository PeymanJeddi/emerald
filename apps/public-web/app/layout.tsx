import type { Metadata } from "next";
import { ConditionalSiteChrome } from "@/components/layout/ConditionalSiteChrome";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { cormorant, inter } from "@/lib/fonts";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="flex min-h-screen flex-col bg-soft-white text-foreground antialiased">
        <AuthProvider>
          <ConditionalSiteChrome>{children}</ConditionalSiteChrome>
        </AuthProvider>
      </body>
    </html>
  );
}
