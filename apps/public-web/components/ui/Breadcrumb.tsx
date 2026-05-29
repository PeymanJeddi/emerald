import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  /** Tighter row for page headers (event detail, etc.) */
  compact?: boolean;
}

export function Breadcrumb({ items, className, compact = false }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(compact ? "py-0" : "mb-6", className)}
    >
      <ol
        className={cn(
          "flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-graphite/55",
          compact ? "text-xs leading-tight" : "text-sm"
        )}
      >
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
            {index > 0 && (
              <span className="shrink-0 text-graphite/35" aria-hidden="true">
                /
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="shrink-0 hover:text-emerald hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="truncate text-graphite/80"
                aria-current="page"
                title={item.label}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
