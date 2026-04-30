-- HmmmNow: leaderboard + submitter attribution migration
-- Run this AFTER reports_migration.sql.

-- 1. Add submitter columns to pending_toilets
ALTER TABLE pending_toilets ADD COLUMN IF NOT EXISTS submitter_name text;
ALTER TABLE pending_toilets ADD COLUMN IF NOT EXISTS is_anonymous boolean DEFAULT true;

-- 2. Add submitter + source columns to toilets
ALTER TABLE toilets ADD COLUMN IF NOT EXISTS submitter_name text;
ALTER TABLE toilets ADD COLUMN IF NOT EXISTS is_anonymous boolean DEFAULT true;
ALTER TABLE toilets ADD COLUMN IF NOT EXISTS source_type text DEFAULT 'seed';

-- 3. Backfill: mark seed rows
UPDATE toilets
SET source_type = 'seed'
WHERE source_type IS NULL;

-- 4. Create toilet_visits table for cumulative click tracking
CREATE TABLE IF NOT EXISTS toilet_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  toilet_id uuid REFERENCES toilets(id) ON DELETE CASCADE,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

-- 5. RLS: public insert only, no public select/update/delete
ALTER TABLE toilet_visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert toilet visits" ON toilet_visits;
CREATE POLICY "Allow public insert toilet visits"
  ON toilet_visits
  FOR INSERT
  WITH CHECK (true);

-- 6. Cumulative leaderboard RPC
CREATE OR REPLACE FUNCTION public.get_toilet_leaderboard(limit_count integer DEFAULT 10)
RETURNS TABLE (
  toilet_id uuid,
  name text,
  area text,
  address text,
  access_type text,
  confidence text,
  source_type text,
  submitter_name text,
  is_anonymous boolean,
  visit_count bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    t.id AS toilet_id,
    t.name,
    t.area,
    t.address,
    t.access_type,
    t.confidence,
    t.source_type,
    t.submitter_name,
    t.is_anonymous,
    count(v.id)::bigint AS visit_count
  FROM public.toilets t
  JOIN public.toilet_visits v
    ON v.toilet_id = t.id
  WHERE t.is_active = true
  GROUP BY
    t.id,
    t.name,
    t.area,
    t.address,
    t.access_type,
    t.confidence,
    t.source_type,
    t.submitter_name,
    t.is_anonymous
  ORDER BY visit_count DESC, t.name ASC
  LIMIT limit_count;
$$;

GRANT EXECUTE ON FUNCTION public.get_toilet_leaderboard(integer) TO anon;
GRANT EXECUTE ON FUNCTION public.get_toilet_leaderboard(integer) TO authenticated;
