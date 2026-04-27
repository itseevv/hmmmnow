import type { ToiletWithDistance } from "../types";
import { walkingTime } from "../lib/distance";

type Props = {
  toilet: ToiletWithDistance;
  rank: number;
};

const badges = ["最像救命的那个", "备选 1", "备选 2"];

export default function ToiletCard({ toilet, rank }: Props) {
  const badge = badges[rank] ?? `备选 ${rank}`;
  const isFirst = rank === 0;

  const openDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${toilet.lat},${toilet.lng}`,
      "_blank"
    );
  };

  return (
    <div
      className={`rounded-2xl shadow-md p-5 mb-4 ${
        isFirst ? "bg-amber-50 border-2 border-amber-300" : "bg-white"
      }`}
    >
      <span
        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${
          isFirst
            ? "bg-amber-400 text-white"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {badge}
      </span>

      <h3 className="text-lg font-bold mb-1">{toilet.name}</h3>
      {toilet.area && (
        <p className="text-sm text-gray-500 mb-2">{toilet.area}</p>
      )}

      <p className="text-sm font-medium text-gray-800 mb-3">
        {walkingTime(toilet.distanceKm)}
      </p>

      <div className="space-y-1.5 text-sm text-gray-600 mb-4">
        <p>
          <span className="text-gray-400">进入方式：</span>
          {toilet.access_type}
        </p>
        {toilet.access_type === "需要 code" && toilet.code && (
          <p>
            <span className="text-gray-400">你懂的：</span>
            {toilet.code}
          </p>
        )}
        {toilet.tip && (
          <p>
            <span className="text-gray-400">小提示：</span>
            {toilet.tip}
          </p>
        )}
        {toilet.confidence && (
          <p>
            <span className="text-gray-400">靠谱程度：</span>
            {toilet.confidence}
          </p>
        )}
        {toilet.opening_hours && (
          <p>
            <span className="text-gray-400">营业时间：</span>
            {toilet.opening_hours}
          </p>
        )}
        {toilet.last_checked && (
          <p>
            <span className="text-gray-400">最近确认：</span>
            {toilet.last_checked}
          </p>
        )}
      </div>

      <button
        onClick={openDirections}
        className="w-full bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all"
      >
        带我过去
      </button>
    </div>
  );
}
