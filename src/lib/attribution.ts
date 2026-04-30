import type { Toilet, LeaderboardEntry } from "../types";

type AttributionSource = Pick<
  Toilet,
  "source_type" | "submitter_name" | "is_anonymous"
> | LeaderboardEntry;

export function getSubmitterLabel(t: AttributionSource): string {
  if (t.source_type === "user_submitted") {
    if (t.is_anonymous || !t.submitter_name) {
      return "由匿名厕所侠提交";
    }
    return `由${t.submitter_name}提交`;
  }
  return "由伦敦厕所侠整理";
}
