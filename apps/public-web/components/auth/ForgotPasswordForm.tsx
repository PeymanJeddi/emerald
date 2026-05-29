"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

const inputClass =
  "mt-1 w-full border border-border bg-white px-4 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: POST /api/auth/forgot-password
    setSent(true);
  }

  if (sent) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          If an account exists for the provided email address, recovery
          instructions will be sent shortly. This is a demonstration flow; no
          email has been sent.
        </p>
        <Link href="/auth/login" className="inline-block text-sm font-medium text-navy hover:underline">
          Return to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-navy">
          Email address
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
      </div>
      <Button type="submit" className="w-full">
        Send Recovery Instructions
      </Button>
      <p className="text-center text-sm text-gray-600">
        <Link href="/auth/login" className="font-medium text-navy hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
