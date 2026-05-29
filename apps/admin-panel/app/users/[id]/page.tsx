"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

type AdminUser = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  affiliation?: string;
  country?: string;
  is_active: boolean;
  is_verified: boolean;
  profile_completion_percent?: number;
  profile_status?: string;
  first_name?: string;
  last_name?: string;
  backup_email?: string;
};

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (id) apiFetch<AdminUser>(`/api/admin/users/${id}`).then(setUser);
  }, [id]);

  if (!user) return <p>Loading...</p>;

  const percent = user.profile_completion_percent ?? 0;
  const complete = user.profile_status === "complete";

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl text-emerald">{user.full_name}</h1>
      <p className="text-sm text-graphite/60">{user.email}</p>

      <div className="archival-card mt-6 rounded-sm p-5">
        <h2 className="font-serif text-lg text-emerald">Profile completion</h2>
        <div className="mt-3 flex items-center gap-4">
          <p className="font-serif text-2xl text-emerald">{percent}%</p>
          <span
            className={`rounded-sm px-2 py-0.5 text-xs ${
              complete ? "bg-emerald/10 text-emerald" : "bg-gold/20 text-graphite"
            }`}
          >
            {user.profile_status || "incomplete"}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
          <div className="h-full bg-emerald" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <dl className="mt-6 space-y-2 text-sm">
        <div>
          <dt className="text-graphite/50">Role</dt>
          <dd className="capitalize">{user.role}</dd>
        </div>
        <div>
          <dt className="text-graphite/50">Affiliation</dt>
          <dd>{user.affiliation || "—"}</dd>
        </div>
        <div>
          <dt className="text-graphite/50">Country</dt>
          <dd>{user.country || "—"}</dd>
        </div>
        <div>
          <dt className="text-graphite/50">Backup email</dt>
          <dd>{user.backup_email || "—"}</dd>
        </div>
        <div>
          <dt className="text-graphite/50">Account status</dt>
          <dd>{user.is_active ? "Active" : "Inactive"}</dd>
        </div>
        <div>
          <dt className="text-graphite/50">Verified</dt>
          <dd>{user.is_verified ? "Yes" : "No"}</dd>
        </div>
      </dl>
    </div>
  );
}
