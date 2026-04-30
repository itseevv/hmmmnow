import { useEffect, useState } from "react";
import type { LeaderboardEntry } from "../types";
import { supabase, hasSupabase } from "../lib/supabase";
import { getSubmitterLabel } from "../lib/attribution";

type Props = {
  onBack: () => void;
};

const medals = ["🥇", "🥈", "🥉"];
const topClasses = ["is-gold", "is-silver", "is-bronze"];

function formatChineseDate(d: Date): string {
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function Leaderboard({ onBack }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!hasSupabase || !supabase) {
        if (!cancelled) setLoading(false);
        return;
      }
      const { data } = await supabase.rpc("get_toilet_leaderboard", { limit_count: 10 });
      if (cancelled) return;
      if (Array.isArray(data)) {
        setEntries(data as LeaderboardEntry[]);
      }
      setLoading(false);
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const today = formatChineseDate(new Date());

  return (
    <div className="px-4 py-6">
      <button
        onClick={onBack}
        className="text-sm mb-4 inline-block"
        style={{ color: "var(--soft)" }}
      >
        ← 回首页
      </button>

      <div className="lb-frame">
        <h2 className="text-2xl font-black text-center mb-1" style={{ color: "var(--ink)" }}>
          厕所功德榜 🏆
        </h2>
        <p className="text-xs text-center mb-2" style={{ color: "var(--gold-deep)" }}>
          阿弥陀佛，今日不拜财神拜桶神🙏
        </p>
        <div className="text-center mb-4">
          <span
            className="inline-block text-[10px] px-2 py-0.5 rounded-md"
            style={{
              border: "1.5px solid var(--gold)",
              color: "var(--gold-deep)",
              transform: "rotate(-1deg)",
            }}
          >
            截至 {today}
          </span>
        </div>

        {loading && (
          <p className="text-center text-sm mt-4" style={{ color: "var(--gold-deep)" }}>
            榜单加载中……
          </p>
        )}

        {!loading && entries.length === 0 && (
          <div>
            <ol className="space-y-2 mb-4">
              {[0, 1, 2, 3, 4].map((i) => {
                const rank = i < 3 ? medals[i] : `0${i + 1}`;
                return (
                  <li key={i} className="lb-row lb-skeleton">
                    <div
                      className="text-xl w-12 text-center shrink-0 font-extrabold"
                      style={{ color: "var(--gold-deep)" }}
                    >
                      {rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="h-2 rounded mb-1.5"
                        style={{ width: "70%", background: "rgba(214,162,78,0.35)" }}
                      />
                      <div
                        className="h-2 rounded mb-1.5"
                        style={{ width: "40%", background: "rgba(214,162,78,0.25)" }}
                      />
                      <p className="text-[11px]" style={{ color: "rgba(168,120,34,0.7)" }}>
                        功德待揭晓
                      </p>
                    </div>
                    <div
                      className="text-xl shrink-0"
                      style={{ color: "rgba(168,120,34,0.5)" }}
                    >
                      ？？？
                    </div>
                  </li>
                );
              })}
            </ol>
            <p
              className="text-center text-sm mt-3"
              style={{ color: "var(--gold-deep)" }}
            >
              第一个点「带我过去」的人，就是开榜大侠。
            </p>
          </div>
        )}

        {!loading && entries.length > 0 && (
          <ol className="space-y-2">
            {entries.map((e, i) => {
              const isTop3 = i < 3;
              const rank = isTop3 ? medals[i] : `0${i + 1}`;
              const cls = isTop3 ? topClasses[i] : "";
              return (
                <li key={e.toilet_id} className={`lb-row ${cls}`}>
                  <div
                    className={`${isTop3 ? "text-2xl" : "text-base font-extrabold"} w-12 text-center shrink-0`}
                    style={!isTop3 ? { color: "var(--gold-deep)" } : undefined}
                  >
                    {rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-[15px] truncate" style={{ color: "var(--ink)" }}>
                      {e.name}
                    </p>
                    {e.area && (
                      <p className="text-[11px] truncate" style={{ color: "var(--soft)" }}>
                        {e.area}
                      </p>
                    )}
                    <p className="text-sm font-bold mt-0.5" style={{ color: "var(--ink)" }}>
                      累计带路 {e.visit_count} 次
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#c8baa3" }}>
                      {getSubmitterLabel(e)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
