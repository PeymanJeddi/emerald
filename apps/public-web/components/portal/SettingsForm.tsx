"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { AcademicCard } from "@/components/ui/AcademicCard";

const inputClass =
  "mt-1 w-full border border-border bg-white px-4 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy";

export function SettingsForm() {
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: PATCH /api/portal/settings
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {saved && (
        <p className="text-sm text-emerald-800" role="status">
          Settings saved. (Demonstration — no data sent to server.)
        </p>
      )}

      <AcademicCard as="section">
        <h2 className="font-serif text-lg text-navy">Account Settings</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="settings-email" className="block text-sm font-medium text-navy">
              Email
            </label>
            <input
              id="settings-email"
              name="email"
              type="email"
              defaultValue="daniel.morgan@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy">
              Password
            </label>
            <p className="mt-1 text-sm text-gray-500">
              Password change will be available when backend authentication is connected.
            </p>
            <Button type="button" variant="secondary" className="mt-2 opacity-60" disabled>
              Change Password
            </Button>
          </div>
        </div>
      </AcademicCard>

      <AcademicCard as="section">
        <h2 className="font-serif text-lg text-navy">Notification Settings</h2>
        <ul className="mt-4 space-y-3 text-sm text-gray-700">
          <li>
            <label className="flex items-center gap-3">
              <input type="checkbox" name="notifyStatus" defaultChecked className="h-4 w-4" />
              Email updates for submission status
            </label>
          </li>
          <li>
            <label className="flex items-center gap-3">
              <input type="checkbox" name="notifyCert" defaultChecked className="h-4 w-4" />
              Email updates for certificate records
            </label>
          </li>
          <li>
            <label className="flex items-center gap-3">
              <input type="checkbox" name="notifyEvents" className="h-4 w-4" />
              Event announcements
            </label>
          </li>
        </ul>
      </AcademicCard>

      <AcademicCard as="section">
        <h2 className="font-serif text-lg text-navy">Privacy Settings</h2>
        <ul className="mt-4 space-y-3 text-sm text-gray-700">
          <li>
            <label className="flex items-center gap-3">
              <input type="checkbox" name="showName" defaultChecked className="h-4 w-4" />
              Show name on public certificate verification pages
            </label>
          </li>
          <li>
            <label className="flex items-center gap-3">
              <input type="checkbox" name="showAffiliation" defaultChecked className="h-4 w-4" />
              Show affiliation on public certificate verification pages
            </label>
          </li>
          <li>
            <label className="flex items-center gap-3">
              <input type="checkbox" name="portalNotify" defaultChecked className="h-4 w-4" />
              Allow portal notifications
            </label>
          </li>
        </ul>
      </AcademicCard>

      <AcademicCard as="section" className="border-red-200">
        <h2 className="font-serif text-lg text-navy">Danger Zone</h2>
        <p className="mt-2 text-sm text-gray-600">
          Account closure requests will be processed when backend services are connected.
        </p>
        <Button type="button" variant="secondary" className="mt-4 opacity-60" disabled>
          Request Account Closure
        </Button>
      </AcademicCard>

      <Button type="submit">Save Settings</Button>
    </form>
  );
}
