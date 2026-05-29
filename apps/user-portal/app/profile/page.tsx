"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/lib/profile-api";
import type { ApplicantProfile } from "@/lib/profile-types";
import { ApplyNowCard } from "@/components/dashboard/ApplyNowCard";
import { ApplicantProfileForm } from "@/components/profile/ApplicantProfileForm";
import { ProfileCompletionCard } from "@/components/dashboard/ProfileCompletionCard";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ApplicantProfile | null>(null);

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  if (!profile) {
    return <p className="text-sm text-graphite/60">Loading profile…</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-emerald">My Profile</h1>
        <p className="mt-2 text-sm text-graphite/70">
          Complete your academic, contact, and identity information to verify eligibility and unlock applications.
        </p>
      </div>

      {profile.completion.can_submit_applications ? (
        <ApplyNowCard />
      ) : (
        <ProfileCompletionCard completion={profile.completion} />
      )}

      <ApplicantProfileForm profile={profile} onUpdated={setProfile} />
    </div>
  );
}
