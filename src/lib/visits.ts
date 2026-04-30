import { supabase, hasSupabase } from "./supabase";

export function directionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export async function trackVisit(toiletId: string): Promise<void> {
  if (!hasSupabase || !supabase) return;
  try {
    const { error } = await supabase
      .from("toilet_visits")
      .insert([{ toilet_id: toiletId }]);
    if (error) {
      console.warn("[HmmmNow] failed to track visit:", error.message);
    }
  } catch (err) {
    console.warn("[HmmmNow] failed to track visit:", err);
  }
}

export function openDirectionsAndTrack(toilet: { id: string; lat: number; lng: number }): void {
  // Fire-and-forget; do not block navigation
  void trackVisit(toilet.id);
  window.open(directionsUrl(toilet.lat, toilet.lng), "_blank");
}
