import { apiFetch } from "@/lib/api";
import type { EventContentJson, EventDetail } from "@/lib/event-detail-types";
import type { Conference, ConferenceStatus, EventFormat } from "@/lib/types";

export type ApiEvent = {
  id: string;
  title: string;
  slug: string;
  event_code: string;
  subtitle?: string | null;
  event_type?: string | null;
  category: string | null;
  location: string | null;
  country: string | null;
  format: string | null;
  start_date: string | null;
  end_date: string | null;
  submission_deadline: string | null;
  registration_deadline?: string | null;
  status: string;
  overview: string | null;
  short_description: string | null;
  cover_image_url: string | null;
  hero_image_url?: string | null;
  hero_video_url?: string | null;
  video_thumbnail_url?: string | null;
  content_json?: EventContentJson | null;
  seo_title?: string | null;
  seo_description?: string | null;
  og_image_url?: string | null;
};

export type EventFilters = {
  years: number[];
  countries: string[];
  conference_types: string[];
  statuses: string[];
  seasons: string[];
  months: number[];
};

export type EventListParams = {
  tab?: "upcoming" | "past" | "completed" | "archived";
  search?: string;
  year?: number;
  month?: number;
  season?: string;
  conference_type?: string;
  country?: string;
  status?: string;
  upcoming_only?: boolean;
  limit?: number;
  offset?: number;
  sort?: "date_asc" | "date_desc";
};

export type EventListResponse = {
  items: ApiEvent[];
  total: number;
  limit: number;
  offset: number;
};

function formatEventDate(start: string | null, end: string | null): string {
  if (!start && !end) return "Dates to be announced";
  if (start && end && start !== end) return `${start} – ${end}`;
  return start || end || "Dates to be announced";
}

function asConferenceStatus(status: string): ConferenceStatus {
  const known: ConferenceStatus[] = [
    "Completed",
    "Upcoming",
    "Open for Registration",
    "Submission Open",
    "Under Review",
    "Registration Open",
    "Ongoing",
    "Archived",
    "Closed",
  ];
  if (known.includes(status as ConferenceStatus)) return status as ConferenceStatus;
  return "Upcoming";
}

function asEventFormat(format: string | null): EventFormat {
  if (format === "Online" || format === "Hybrid" || format === "In-person") return format;
  return "Hybrid";
}

export function mapApiEventToConference(e: ApiEvent): Conference {
  return {
    title: e.title,
    slug: e.slug,
    date: formatEventDate(e.start_date, e.end_date),
    startDate: e.start_date,
    endDate: e.end_date,
    submissionDeadline: e.submission_deadline,
    location: e.location || "—",
    country: e.country || undefined,
    format: asEventFormat(e.format),
    status: asConferenceStatus(e.status),
    category: e.category || "Conference",
    eventReferenceCode: e.event_code,
    overview: e.overview || "",
    shortDescription: e.short_description || e.overview || "",
    coverImageUrl: e.cover_image_url,
  };
}

function buildQuery(params: EventListParams): string {
  const q = new URLSearchParams();
  if (params.tab) q.set("tab", params.tab);
  if (params.search) q.set("search", params.search);
  if (params.year) q.set("year", String(params.year));
  if (params.month) q.set("month", String(params.month));
  if (params.season) q.set("season", params.season);
  if (params.conference_type) q.set("conference_type", params.conference_type);
  if (params.country) q.set("country", params.country);
  if (params.status) q.set("status", params.status);
  if (params.upcoming_only) q.set("upcoming_only", "true");
  if (params.limit) q.set("limit", String(params.limit));
  if (params.offset) q.set("offset", String(params.offset));
  if (params.sort) q.set("sort", params.sort);
  const s = q.toString();
  return s ? `?${s}` : "";
}

export async function fetchPublicEvents(params: EventListParams = {}): Promise<EventListResponse> {
  return apiFetch<EventListResponse>(`/api/public/events${buildQuery(params)}`);
}

export async function fetchEventFilters(): Promise<EventFilters> {
  try {
    return await apiFetch<EventFilters>("/api/public/events/filters");
  } catch {
    return { years: [], countries: [], conference_types: [], statuses: [], seasons: [], months: [] };
  }
}

export async function fetchPublicEventBySlug(slug: string): Promise<Conference | null> {
  const detail = await fetchPublicEventDetail(slug);
  if (!detail) return null;
  return mapDetailToConference(detail);
}

export async function fetchPublicEventDetail(slug: string): Promise<EventDetail | null> {
  try {
    const e = await apiFetch<ApiEvent>(`/api/public/events/${encodeURIComponent(slug)}`);
    return mapApiEventToDetail(e);
  } catch {
    return null;
  }
}

export function mapApiEventToDetail(e: ApiEvent): EventDetail {
  return {
    id: e.id,
    title: e.title,
    slug: e.slug,
    event_code: e.event_code,
    subtitle: e.subtitle ?? null,
    event_type: e.event_type ?? null,
    category: e.category,
    location: e.location,
    country: e.country ?? null,
    format: e.format,
    start_date: e.start_date,
    end_date: e.end_date,
    submission_deadline: e.submission_deadline,
    registration_deadline: e.registration_deadline ?? null,
    status: e.status,
    overview: e.overview,
    short_description: e.short_description,
    cover_image_url: e.cover_image_url,
    hero_image_url: e.hero_image_url ?? null,
    hero_video_url: e.hero_video_url ?? null,
    video_thumbnail_url: e.video_thumbnail_url ?? null,
    content_json: e.content_json ?? null,
    seo_title: e.seo_title ?? null,
    seo_description: e.seo_description ?? null,
    dateLabel: formatEventDate(e.start_date, e.end_date),
  };
}

function mapDetailToConference(d: EventDetail): Conference {
  return {
    title: d.title,
    slug: d.slug,
    date: d.dateLabel,
    startDate: d.start_date,
    endDate: d.end_date,
    submissionDeadline: d.submission_deadline,
    location: d.location || "—",
    country: d.country || undefined,
    format: asEventFormat(d.format),
    status: asConferenceStatus(d.status),
    category: d.category || "Conference",
    eventReferenceCode: d.event_code,
    overview: d.overview || d.content_json?.overview_markdown || "",
    shortDescription: d.short_description || "",
    coverImageUrl: d.cover_image_url || d.hero_image_url,
  };
}

export const EVENT_VERIFICATION_NOTE =
  "Participation and certificate records related to this event can be validated only through the official certificate verification system using a valid certificate code.";

export function isPastConference(status: ConferenceStatus): boolean {
  return status === "Completed" || status === "Archived" || status === "Closed";
}
