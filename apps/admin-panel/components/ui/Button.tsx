import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton extends ButtonBaseProps {
  href?: undefined;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  type?: never;
  onClick?: never;
  disabled?: never;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-emerald text-ivory border border-emerald hover:bg-emerald-accent focus-visible:ring-emerald",
  secondary:
    "bg-ivory text-emerald border border-emerald hover:bg-soft-white focus-visible:ring-emerald",
  ghost:
    "bg-transparent text-emerald border border-transparent hover:bg-ivory focus-visible:ring-emerald",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm",
    variantStyles[variant],
    className
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={styles}>
        {children}
      </Link>
    );
  }

  const { type = "button", onClick, disabled } = props as ButtonAsButton;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={styles}
    >
      {children}
    </button>
  );
}
