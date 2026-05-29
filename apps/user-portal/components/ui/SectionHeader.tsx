import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-gold">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-2xl font-medium text-emerald sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-graphite/80">
          {description}
        </p>
      )}
      <div className="gold-divider mt-6 max-w-xs" aria-hidden />
    </div>
  );
}
