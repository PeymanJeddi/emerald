import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PORTAL_LOGIN_URL } from "@/lib/portal-urls";
import { SITE_NAME } from "@/lib/utils";

export function TopBar() {
  return (
    <div className="border-b border-gold/20 bg-emerald-dark text-ivory">
      <Container>
        <div className="flex h-9 items-center justify-between text-xs">
          <span className="font-medium tracking-wide">{SITE_NAME}</span>
          <div className="flex items-center gap-4">
            <Link
              href="/verify"
              className="transition-colors hover:text-gold"
            >
              Certificate Verification
            </Link>
            <Link
              href={PORTAL_LOGIN_URL}
              className="transition-colors hover:text-gold"
            >
              Academic Portal
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
