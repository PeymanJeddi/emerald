"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { API_URL } from "@/lib/api";

const inputClass =
  "mt-1 w-full border border-border bg-soft-white px-4 py-2.5 text-sm focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald";

export function AdminLoginForm() {
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
      const res = await fetch(`${API_URL}/api/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Invalid admin credentials");
      }
      const data = await res.json();
      localStorage.setItem("esc_admin_token", data.access_token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-emerald">
          Admin email
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
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign in to Admin Panel"}
      </Button>
    </form>
  );
}
