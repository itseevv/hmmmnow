-- HmmmNow: confidence + reports migration
-- Run this AFTER the initial seed.sql migration.

-- 1. Backfill all current toilets to confidence = '高'
UPDATE toilets
SET confidence = '高'
WHERE confidence IS DISTINCT FROM '高';

-- 2. Create toilet_reports table
CREATE TABLE IF NOT EXISTS toilet_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  toilet_id uuid REFERENCES toilets(id) ON DELETE CASCADE,
  report_type text NOT NULL,
  note text,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

-- 3. Enable RLS, allow public insert only (no public select/update/delete)
ALTER TABLE toilet_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert toilet reports" ON toilet_reports;
CREATE POLICY "Allow public insert toilet reports"
  ON toilet_reports
  FOR INSERT
  WITH CHECK (true);

-- 4. Confidence update RPC (security definer so anon can call without direct toilets update permission)
CREATE OR REPLACE FUNCTION public.update_toilet_confidence(target_toilet_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  report_count integer;
  new_confidence text;
BEGIN
  SELECT count(*) INTO report_count
  FROM public.toilet_reports
  WHERE toilet_id = target_toilet_id;

  IF report_count >= 5 THEN
    new_confidence := '低';
  ELSIF report_count >= 2 THEN
    new_confidence := '中';
  ELSE
    new_confidence := '高';
  END IF;

  UPDATE public.toilets
  SET confidence = new_confidence
  WHERE id = target_toilet_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_toilet_confidence(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.update_toilet_confidence(uuid) TO authenticated;
