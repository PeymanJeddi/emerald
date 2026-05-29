"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { API_URL } from "@/lib/api";

const PORTAL_URL = process.env.NEXT_PUBLIC_USER_PORTAL_URL || "http://localhost:3001";

const inputClass =
  "mt-1 w-full border border-border bg-soft-white px-4 py-2.5 text-sm focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald";

export function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Invalid credentials");
      }
      const data = await res.json();
      localStorage.setItem("esc_token", data.access_token);
      window.location.href = `${PORTAL_URL}/dashboard`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-emerald">
          Email address
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-emerald">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>

      {error && (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-center text-sm text-graphite/70">
        No account?{" "}
        <Link href="/auth/register" className="font-medium text-emerald hover:underline">
          Create account
        </Link>
      </p>
    </form>
  );
}
