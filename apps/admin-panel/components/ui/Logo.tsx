import Link from "next/link";
import { SITE_NAME, SITE_SHORT } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "light" | "dark";
  showSubtitle?: boolean;
  className?: string;
  href?: string;
}

export function Logo({
  variant = "dark",
  showSubtitle = false,
  className,
  href = "/",
}: LogoProps) {
  const textClass = variant === "light" ? "text-ivory" : "text-emerald";
  const subClass = variant === "light" ? "text-ivory/70" : "text-graphite/70";

  const content = (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative flex h-10 w-10 shrink-0 items-center justify-center border",
          variant === "light"
            ? "border-gold/50 bg-emerald-dark"
            : "border-gold/60 bg-emerald"
        )}
        aria-hidden
      >
        <svg viewBox="0 0 40 40" className="h-7 w-7" fill="none">
          <path
            d="M20 4L34 12V28L20 36L6 28V12L20 4Z"
            stroke="#B89B5E"
            strokeWidth="1"
            fill={variant === "light" ? "#0A2B26" : "#145C50"}
          />
          <circle cx="20" cy="20" r="6" stroke="#B89B5E" strokeWidth="0.75" />
          <path
            d="M20 14V26M14 20H26"
            stroke="#F7F4EE"
            strokeWidth="0.5"
            opacity="0.6"
          />
        </svg>
      </div>
      <div>
        <span
          className={cn(
            "font-serif text-base leading-tight sm:text-lg",
            textClass
          )}
        >
          {SITE_SHORT}
        </span>
        {showSubtitle && (
          <span className={cn("mt-0.5 block text-xs tracking-wide", subClass)}>
            Congress & Verification
          </span>
        )}
        <span className="sr-only">{SITE_NAME}</span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group">
        {content}
      </Link>
    );
  }

  return content;
}
