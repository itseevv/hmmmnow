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
};

export type ViewState = "home" | "panic" | "add";
