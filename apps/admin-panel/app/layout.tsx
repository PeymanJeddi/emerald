import { Cormorant_Garamond, Inter } from "next/font/google";
import { AdminShell } from "@/components/AdminShell";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-cormorant" });

export const metadata = { title: "ESC Admin Panel" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
