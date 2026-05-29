import { AuthLayout } from "@/components/auth/AuthLayout";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Recover access to your applicant portal account.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Password recovery"
      subtitle="Enter your registered email address and we will send recovery instructions if an account exists."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
