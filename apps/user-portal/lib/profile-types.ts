export type ProfileSectionKey =
  | "personal"
  | "contact"
  | "academic"
  | "affiliation"
  | "researcher"
  | "identity"
  | "consents";

export interface ProfileCompletionState {
  percent: number;
  status: string;
  can_submit_applications: boolean;
  missing_fields: { section: string; field: string; label: string }[];
  sections: Record<string, { complete: boolean; percent: number }>;
  identity_verification_status: string;
}

export interface ApplicantProfile {
  id: string;
  email: string;
  full_name: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  middle_name: string | null;
  profile_photo_url: string | null;
  country: string | null;
  city: string | null;
  affiliation: string | null;
  department: string | null;
  professional_role: string | null;
  bio: string | null;
  is_verified: boolean;
  created_at: string;
  profile: Record<string, Record<string, unknown>>;
  completion: ProfileCompletionState;
}

export interface DashboardData {
  user: ApplicantProfile;
  recent_submissions: {
    id: string;
    submission_code: string;
    title: string;
    status: string;
    submitted_at: string | null;
    last_updated_at: string | null;
  }[];
  unread_messages_count: number;
  document_status: string;
}

export interface ProfileUpdatePayload {
  personal?: Record<string, unknown>;
  contact?: Record<string, unknown>;
  academic?: Record<string, unknown>;
  affiliation?: Record<string, unknown>;
  researcher?: Record<string, unknown>;
  identity?: Record<string, unknown>;
  consents?: Record<string, unknown>;
  research_interests?: string[];
}
