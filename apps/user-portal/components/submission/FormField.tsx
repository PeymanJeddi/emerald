import { cn } from "@/lib/utils";

const inputClass =
  "mt-1 w-full rounded-sm border border-border bg-soft-white px-4 py-2.5 text-sm focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald";

interface Props {
  id: string;
  label: string;
  helper?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ id, label, helper, required, error, children, className }: Props) {
  return (
    <div className={cn("space-y-1", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-graphite">
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </label>
      {helper && <p className="text-xs text-graphite/60">{helper}</p>}
      {children}
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}

export { inputClass };
