export type Toilet = {
  id: string;
  name: string;
  area?: string | null;
  address: string;
  lat: number;
  lng: number;
  access_type: string;
  code?: string | null;
  tip?: string | null;
  hmmm_note?: string | null;
  opening_hours?: string | null;
  confidence?: string | null;
  last_checked?: string | null;
  is_active: boolean;
  created_at?: string;
  source_type?: string | null;
  submitter_name?: string | null;
  is_anonymous?: boolean | null;
};

export type ToiletWithDistance = Toilet & {
  distanceKm: number;
};

export type PendingToiletInput = {
  name: string;
  area_or_address?: string;
  access_type?: string;
  code?: string;
  tip?: string;
  extra_note?: string;
  lat?: number;
  lng?: number;
  submitter_name?: string | null;
  is_anonymous?: boolean;
};

export type LeaderboardEntry = {
  toilet_id: string;
  name: string;
  area: string | null;
  address: string;
  access_type: string;
  confidence: string | null;
  source_type: string | null;
  submitter_name: string | null;
  is_anonymous: boolean | null;
  visit_count: number;
};

export type ViewState = "home" | "panic" | "add" | "leaderboard";
