"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type User = { id: string; full_name: string; email: string; role: string; country: string | null; is_active: boolean; created_at: string };

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    apiFetch<User[]>("/api/admin/users").then(setUsers);
  }, []);

  return (
    <div>
      <h1 className="font-serif text-3xl text-emerald">Users</h1>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-graphite/60">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Country</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border">
                <td className="py-3">{u.full_name}</td>
                <td>{u.email}</td>
                <td className="capitalize">{u.role}</td>
                <td>{u.country || "—"}</td>
                <td>{u.is_active ? "Active" : "Inactive"}</td>
                <td><Link href={`/users/${u.id}`} className="text-emerald underline">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
