import { cn } from "@/lib/utils";

interface AcademicCardProps {
  children: React.ReactNode;
  className?: string;
  as?: "article" | "div" | "section";
}

export function AcademicCard({
  children,
  className,
  as: Component = "div",
}: AcademicCardProps) {
  return (
    <Component
      className={cn(
        "rounded-sm border border-border bg-soft-white p-6",
        className
      )}
    >
      {children}
    </Component>
  );
}
