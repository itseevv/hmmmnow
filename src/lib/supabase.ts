import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const hasSupabase = !!(supabaseUrl && supabaseKey);

export const supabase = hasSupabase
  ? createClient(supabaseUrl!, supabaseKey!)
  : null;

if (!hasSupabase) {
  console.warn("[HmmmNow] Supabase env vars missing — using mock data");
}
