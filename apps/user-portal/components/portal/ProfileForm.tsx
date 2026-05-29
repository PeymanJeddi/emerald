"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { AcademicCard } from "@/components/ui/AcademicCard";
import type { PortalUser } from "@/lib/portal/types";

const inputClass =
  "mt-1 w-full border border-border bg-white px-4 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy";

interface ProfileFormProps {
  user: PortalUser;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: PATCH /api/portal/profile
    setSaved(true);
  }

  return (
    <AcademicCard>
      {saved && (
        <p className="mb-4 text-sm text-emerald-800" role="status">
          Profile saved successfully. (Demonstration — no data sent to server.)
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-navy">
            Profile photo
          </label>
          <div className="mt-2 flex h-24 w-24 items-center justify-center border border-dashed border-border bg-ivory text-xs text-gray-500">
            Upload placeholder
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-navy">
              Full legal name
            </label>
            <input
              id="fullName"
              name="fullName"
              defaultValue={user.fullName}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-navy">
              Display name
            </label>
            <input
              id="displayName"
              name="displayName"
              defaultValue={user.displayName}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-navy">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={user.email}
            className={inputClass}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-navy">
              Country / Region
            </label>
            <input
              id="country"
              name="country"
              defaultValue={user.country}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-navy">
              City
            </label>
            <input id="city" name="city" defaultValue={user.city} className={inputClass} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="affiliation" className="block text-sm font-medium text-navy">
              Affiliation
            </label>
            <input
              id="affiliation"
              name="affiliation"
              defaultValue={user.affiliation}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-navy">
              Department
            </label>
            <input
              id="department"
              name="department"
              defaultValue={user.department ?? ""}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-navy">
            Role
          </label>
          <input id="role" name="role" defaultValue={user.role} className={inputClass} />
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-navy">
            Short biography
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            defaultValue={user.bio}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-navy">
            Research interests
          </label>
          <input
            id="interests"
            name="interests"
            defaultValue={user.researchInterests.join(", ")}
            className={inputClass}
            placeholder="Comma-separated"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-navy">
              Website
            </label>
            <input
              id="website"
              name="website"
              type="url"
              defaultValue={user.website ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="orcid" className="block text-sm font-medium text-navy">
              ORCID (optional)
            </label>
            <input
              id="orcid"
              name="orcid"
              defaultValue={user.orcid ?? ""}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium text-navy">
            LinkedIn (optional)
          </label>
          <input
            id="linkedin"
            name="linkedin"
            defaultValue={user.linkedin ?? ""}
            className={inputClass}
          />
        </div>
        <Button type="submit">Save Profile</Button>
      </form>
    </AcademicCard>
  );
}
