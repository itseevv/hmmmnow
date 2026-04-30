import { useState } from "react";
import type { ToiletWithDistance } from "../types";
import { walkingTime } from "../lib/distance";
import { openDirectionsAndTrack } from "../lib/visits";
import { getSubmitterLabel } from "../lib/attribution";
import ReportSheet from "./ReportSheet";

type Props = {
  toilet: ToiletWithDistance;
  rank: number;
};

const badges = ["最近续命点", "备选 1", "备选 2"];

function accessChipClass(accessType: string): string {
  if (accessType.startsWith("免费")) return "chip chip-free";
  if (accessType.startsWith("需要 code")) return "chip chip-code";
  if (accessType.startsWith("需要消费")) return "chip chip-pay";
  if (accessType.startsWith("问店员")) return "chip chip-ask";
  return "chip chip-unsure";
}

function confidenceChipClass(c: string): string {
  if (c === "高") return "chip chip-score-high";
  if (c === "中") return "chip chip-score-mid";
  return "chip chip-score-low";
}

export default function ToiletCard({ toilet, rank }: Props) {
  const badge = badges[rank] ?? `备选 ${rank}`;
  const isFirst = rank === 0;
  const [reporting, setReporting] = useState(false);

  const openDirections = () => openDirectionsAndTrack(toilet);
  const isCode = toilet.access_type === "需要 code";

  const cardStyle = isFirst
    ? {
        background: "linear-gradient(160deg, #fff5d4, #f9dfa1)",
        transform: "rotate(-1.2deg)",
      }
    : { background: "white" };

  return (
    <div
      className={`relative rounded-3xl p-5 mb-6 mx-1 ${
        isFirst ? "gold-plaque-shadow" : "sticker-shadow"
      }`}
      style={cardStyle}
    >
      {isFirst && <span className="chosen-sticker">圣选</span>}

      <button
        onClick={() => setReporting((r) => !r)}
        className={`absolute top-3 right-3 report-trigger ${reporting ? "is-active" : ""}`}
        aria-label="信息不对劲"
      >
        不对劲？
      </button>

      <span className={`stamp-badge ${isFirst ? "is-chosen" : ""}`}>
        {badge}
      </span>

      <h3 className="text-lg font-extrabold mt-3 mb-1 pr-20" style={{ color: "var(--ink)" }}>
        {toilet.name}
      </h3>
      {toilet.area && (
        <p className="text-xs mb-2" style={{ color: "var(--soft)" }}>
          {toilet.area}
        </p>
      )}

      <p className="text-sm font-bold mb-3" style={{ color: "var(--ink)" }}>
        {walkingTime(toilet.distanceKm)}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={accessChipClass(toilet.access_type)}>
          {isCode && toilet.code ? `🔑 ${toilet.access_type} · ${toilet.code}` : toilet.access_type}
        </span>
        {toilet.confidence && (
          <span className={confidenceChipClass(toilet.confidence)}>
            靠谱程度 {toilet.confidence}
          </span>
        )}
      </div>

      <div className="space-y-1 text-sm mb-4" style={{ color: "var(--ink)" }}>
        {toilet.tip && (
          <p>
            <span style={{ color: "var(--soft)", fontWeight: 600 }}>小提示：</span>
            {toilet.tip}
          </p>
        )}
        {toilet.opening_hours && (
          <p>
            <span style={{ color: "var(--soft)", fontWeight: 600 }}>营业时间：</span>
            {toilet.opening_hours}
          </p>
        )}
        {toilet.last_checked && (
          <p>
            <span style={{ color: "var(--soft)", fontWeight: 600 }}>最近确认：</span>
            {toilet.last_checked}
          </p>
        )}
      </div>

      <button
        onClick={openDirections}
        className="decree-shadow w-full text-white font-extrabold py-3 rounded-2xl transition-all"
        style={{ background: "var(--blue)" }}
      >
        <span className="opacity-80 text-xs mr-2">✦</span>
        快带朕去
        <span className="opacity-80 text-xs ml-2">✦</span>
      </button>

      <p className="text-[10px] text-right mt-2" style={{ color: "#c8baa3" }}>
        {getSubmitterLabel(toilet)}
      </p>

      {reporting && (
        <ReportSheet toiletId={toilet.id} onClose={() => setReporting(false)} />
      )}
    </div>
  );
}
