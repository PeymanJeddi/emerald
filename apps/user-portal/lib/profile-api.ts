import { apiFetch, API_URL, getToken } from "@/lib/api";
import type { ApplicantProfile, DashboardData, ProfileUpdatePayload } from "@/lib/profile-types";

export function getProfile() {
  return apiFetch<ApplicantProfile>("/api/me/profile");
}

export function getDashboard() {
  return apiFetch<DashboardData>("/api/me/dashboard");
}

export function updateProfile(payload: ProfileUpdatePayload) {
  return apiFetch<ApplicantProfile>("/api/me/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function uploadIdentityDocument(form: FormData) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/me/profile/identity-document`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(typeof err.detail === "string" ? err.detail : "Upload failed");
  }
  return res.json() as Promise<ApplicantProfile>;
}
