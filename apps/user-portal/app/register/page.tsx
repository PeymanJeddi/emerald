import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { SITE_NAME } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: `Register for the ${SITE_NAME} applicant portal.`,
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your applicant account"
      subtitle="Register to submit academic materials, track your conference applications, and access verified participation records."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
