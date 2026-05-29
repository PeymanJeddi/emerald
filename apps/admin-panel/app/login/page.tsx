import { AuthLayout } from "@/components/auth/AuthLayout";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import { SITE_NAME } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Sign In",
  description: `Administrator sign in for ${SITE_NAME}.`,
};

export default function AdminLoginPage() {
  return (
    <AuthLayout
      title="Administrator sign in"
      subtitle="Access the management dashboard for events, submissions, certificates, and site content."
    >
      <AdminLoginForm />
    </AuthLayout>
  );
}
