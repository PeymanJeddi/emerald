import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { SITE_NAME } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: `Sign in to the ${SITE_NAME} applicant portal.`,
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Sign in to your Academic Portal"
      subtitle="Access your submission dashboard, certificate records, and academic event participation details."
    >
      <LoginForm />
    </AuthLayout>
  );
}
