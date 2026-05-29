export type EventDateItem = { label: string; date: string };
export type EventTopic = { title: string; description?: string };
export type EventPerson = {
  full_name: string;
  position?: string;
  institution?: string;
  country?: string;
  bio?: string;
  profile_image_url?: string;
  linkedin?: string;
  website?: string;
};
export type EventPeopleGroup = { group: string; people: EventPerson[] };
export type EventScheduleItem = {
  day?: string;
  time?: string;
  session?: string;
  speaker?: string;
  description?: string;
  room?: string;
};
export type EventGalleryItem = { url: string; caption?: string; category?: string };
export type EventVideoItem = {
  title: string;
  url: string;
  thumbnail_url?: string;
  duration?: string;
  speaker?: string;
  category?: string;
};
export type EventPublication = {
  title: string;
  doi?: string;
  download_url?: string;
  authors?: string;
  journal?: string;
};
export type EventSponsor = { name: string; logo_url?: string; url?: string; level?: string };
export type EventFAQ = { question: string; answer: string };
export type EventCTA = {
  title?: string;
  subtitle?: string;
  primary_label?: string;
  primary_url?: string;
  secondary_label?: string;
  secondary_url?: string;
};
export type EventVenue = {
  venue_name?: string;
  address?: string;
  city?: string;
  country?: string;
  maps_url?: string;
  online_platform?: string;
};
export type EventQuickInfo = {
  organizer?: string;
  language?: string;
  publication_type?: string;
  indexing?: string[];
  certificates_available?: boolean;
};

export type EventContentJson = {
  overview_markdown?: string;
  important_dates?: EventDateItem[];
  topics?: EventTopic[];
  people_groups?: EventPeopleGroup[];
  submission?: {
    guidelines_markdown?: string;
    publication_markdown?: string;
    requirements?: string[];
  };
  schedule?: EventScheduleItem[];
  venue?: EventVenue;
  quick_info?: EventQuickInfo;
  gallery?: EventGalleryItem[];
  videos?: EventVideoItem[];
  publications?: EventPublication[];
  sponsors?: EventSponsor[];
  faq?: EventFAQ[];
  cta?: EventCTA;
  footer_cta?: EventCTA;
  hero?: EventCTA & { overlay_opacity?: number };
};

export type EventDetail = {
  id: string;
  title: string;
  slug: string;
  event_code: string;
  subtitle: string | null;
  event_type: string | null;
  category: string | null;
  location: string | null;
  country: string | null;
  format: string | null;
  start_date: string | null;
  end_date: string | null;
  submission_deadline: string | null;
  registration_deadline: string | null;
  status: string;
  overview: string | null;
  short_description: string | null;
  cover_image_url: string | null;
  hero_image_url: string | null;
  hero_video_url: string | null;
  video_thumbnail_url: string | null;
  content_json: EventContentJson | null;
  seo_title: string | null;
  seo_description: string | null;
  dateLabel: string;
};
