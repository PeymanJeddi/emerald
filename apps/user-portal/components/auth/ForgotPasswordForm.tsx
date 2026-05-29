"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

const inputClass =
  "mt-1 w-full border border-border bg-soft-white px-4 py-2.5 text-sm focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-graphite/80">
          If an account exists for the provided email address, recovery instructions will be sent
          shortly. Contact support if you need immediate assistance.
        </p>
        <Link href="/login" className="inline-block text-sm font-medium text-emerald hover:underline">
          Return to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-emerald">
          Email address
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
      </div>
      <Button type="submit" className="w-full">
        Send Recovery Instructions
      </Button>
      <p className="text-center text-sm text-graphite/70">
        <Link href="/login" className="font-medium text-emerald hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
