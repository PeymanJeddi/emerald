"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { API_URL } from "@/lib/api";

const PORTAL_URL = process.env.NEXT_PUBLIC_USER_PORTAL_URL || "http://localhost:3001";

const inputClass =
  "mt-1 w-full border border-border bg-soft-white px-4 py-2.5 text-sm focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald";

export function RegisterForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirmPassword") ?? "");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.get("agreement")) {
      setError("You must confirm the agreement to register.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(form.get("email") ?? ""),
          password,
          full_name: String(form.get("fullName") ?? ""),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(typeof err.detail === "string" ? err.detail : "Registration failed");
      }
      const data = await res.json();
      localStorage.setItem("esc_token", data.access_token);
      window.location.href = `${PORTAL_URL}/dashboard`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-emerald">
          Full legal name
        </label>
        <input id="fullName" name="fullName" type="text" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-emerald">
          Email address
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-emerald">
            Password
          </label>
          <input id="password" name="password" type="password" required minLength={8} className={inputClass} />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-emerald">
            Confirm password
          </label>
          <input id="confirmPassword" name="confirmPassword" type="password" required className={inputClass} />
        </div>
      </div>
      <label className="flex items-start gap-3 text-sm text-graphite/70">
        <input type="checkbox" name="agreement" required className="mt-1 h-4 w-4" />
        I confirm that the information I provide is accurate.
      </label>
      {error && (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account…" : "Create Account"}
      </Button>
      <p className="text-center text-sm text-graphite/70">
        Already registered?{" "}
        <Link href="/auth/login" className="font-medium text-emerald hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
