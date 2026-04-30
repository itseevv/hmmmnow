import { useEffect, useState } from "react";
import { supabase, hasSupabase } from "../lib/supabase";
import { mockToilets } from "../data/mockToilets";

type Props = {
  onPanic: () => void;
  onAdd: () => void;
  onLeaderboard: () => void;
};

export default function Home({ onPanic, onAdd, onLeaderboard }: Props) {
  const [activeCount, setActiveCount] = useState(mockToilets.length);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!hasSupabase || !supabase) return;
    supabase.from("toilets").select("id", { count: "exact", head: true }).eq("is_active", true)
      .then(({ count }) => { if (count != null) setActiveCount(count); });
    supabase.rpc("get_pending_toilets_count")
      .then(({ data }) => { if (typeof data === "number" && data > 0) setPendingCount(data); });
  }, []);

  return (
    <div className="flex flex-col items-center min-h-dvh px-6 pb-6 text-center">
      <div className="pt-14">
        <h1 className="text-[40px] font-black tracking-tight mb-5 whitespace-nowrap">
          Hmmm
          <span
            className="inline-block align-baseline ml-1 px-3.5 py-0.5 text-white rounded-full"
            style={{
              background: "var(--coral)",
              transform: "rotate(-4deg)",
              letterSpacing: "0.02em",
              boxShadow:
                "0 4px 0 var(--coral-deep), 0 8px 18px -6px rgba(255,90,77,0.45)",
            }}
          >
            NOW
          </span>
        </h1>
        <p className="text-base" style={{ color: "var(--soft)" }}>
          伦敦厕所侠の智慧集锦🫶
        </p>
      </div>

      <div
        className="text-[170px] leading-none mt-12 mb-12"
        style={{
          animation: "float 3s ease-in-out infinite",
          filter: "drop-shadow(0 12px 0 #f0e0c8)",
        }}
      >
        🚽
      </div>

      <div className="w-full flex flex-col items-center">
        <button
          onClick={onPanic}
          className="panic-shadow w-full max-w-xs text-white text-xl font-extrabold py-5 px-8 rounded-full mb-5 transition-all"
          style={{
            background: "var(--coral)",
            animation: "wiggle 4s ease-in-out infinite",
          }}
        >
          🚨 快憋不住啦！
        </button>

        <button
          onClick={onAdd}
          className="parchment-shadow w-full max-w-xs text-base font-semibold py-3 px-6 rounded-full mb-7 transition-all border-2 border-dashed"
          style={{
            background: "var(--parchment)",
            color: "var(--ink)",
            borderColor: "#d8c8a8",
          }}
        >
          ➕ 我也知道一处宝地
        </button>

        <p className="text-xs" style={{ color: "var(--soft)" }}>
          已收录 {activeCount} 个救命地点
        </p>
        {pendingCount > 0 && (
          <p className="text-xs mt-1" style={{ color: "#b9ad99" }}>
            收到 {pendingCount} 个民间线索
          </p>
        )}
      </div>

      <button
        onClick={onLeaderboard}
        className="relative mt-12 inline-flex items-center gap-2 active:scale-95 transition-all text-sm font-extrabold px-5 py-2.5 rounded-full"
        style={{
          background: "linear-gradient(160deg, #fff5d4, #f4dc94)",
          color: "#6b4f1a",
          border: "2px dashed var(--gold)",
          transform: "rotate(-3deg)",
          boxShadow:
            "0 6px 0 rgba(168, 120, 34, 0.25), 0 14px 28px -10px rgba(168, 120, 34, 0.35)",
        }}
      >
        <span className="text-base">🏆</span>
        <span>厕所功德榜</span>
        <span className="text-base">🛕</span>
        <span
          className="absolute text-lg"
          style={{
            top: "-10px",
            right: "-8px",
            animation: "spark 2.4s ease-in-out infinite",
          }}
        >
          ✨
        </span>
      </button>

      <p className="mt-12 text-[10px]" style={{ color: "#c8baa3" }}>
        厕所信息可能会变。请友好使用，别为难 staff。
      </p>
    </div>
  );
}
