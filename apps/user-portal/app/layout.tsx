import { Cormorant_Garamond, Inter } from "next/font/google";
import { PortalShell } from "@/components/PortalShell";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-cormorant" });

export const metadata = { title: "ESC User Portal" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        <PortalShell>{children}</PortalShell>
      </body>
    </html>
  );
}
