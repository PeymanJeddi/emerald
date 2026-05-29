import { Logo } from "@/components/ui/Logo";
import { PUBLIC_WEB_URL } from "@/lib/site-urls";
import { SITE_NAME } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="hidden border-r border-gold/20 bg-emerald-dark px-10 py-16 text-ivory lg:flex lg:flex-col lg:justify-between">
          <div>
            <Logo variant="light" showSubtitle href={PUBLIC_WEB_URL} />
            <p className="mt-8 max-w-md text-sm leading-relaxed text-ivory/85">
              Secure administrative access for conference management, submission review, certificate
              issuance, and CMS content for {SITE_NAME}.
            </p>
          </div>
          <p className="text-xs tracking-wide text-ivory/50">Staff & administrator access only</p>
        </div>

        <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="mb-8 lg:hidden">
            <Logo showSubtitle href={PUBLIC_WEB_URL} />
          </div>
          <div className="mx-auto w-full max-w-md">
            <h1 className="font-serif text-2xl font-medium text-emerald">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-graphite/80">{subtitle}</p>
            <div className="gold-divider my-6" aria-hidden />
            <div className="border border-border bg-soft-white p-6 shadow-sm sm:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
