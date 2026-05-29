import { Badge, statusLabelToVariant } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { CertificateStatus as Status } from "@/lib/types";

interface CertificateStatusProps {
  status: Status;
}

export function CertificateStatus({ status }: CertificateStatusProps) {
  const isVerified = status === "Verified";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2",
        isVerified && "rounded-sm border border-gold/50 bg-emerald/10 px-2 py-1"
      )}
    >
      {isVerified && (
        <span
          className="flex h-5 w-5 items-center justify-center rounded-full border border-gold bg-emerald text-[10px] text-ivory"
          aria-hidden
        >
          ✓
        </span>
      )}
      <Badge variant={statusLabelToVariant(status)}>{status}</Badge>
    </span>
  );
}
