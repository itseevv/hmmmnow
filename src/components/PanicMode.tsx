import { useEffect, useState } from "react";
import type { Toilet, ToiletWithDistance } from "../types";
import { getDistanceKm } from "../lib/distance";
import { supabase, hasSupabase } from "../lib/supabase";
import { mockToilets } from "../data/mockToilets";
import ToiletCard from "./ToiletCard";
import MiniMap from "./MiniMap";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

type Props = {
  onBack: () => void;
  onAdd: () => void;
};

type Status = "loading" | "results" | "denied" | "error" | "empty";

export default function PanicMode({ onBack, onAdd }: Props) {
  const [status, setStatus] = useState<Status>("loading");
  const [nearest, setNearest] = useState<ToiletWithDistance[]>([]);
  const [allToilets, setAllToilets] = useState<Toilet[]>([]);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserPos({ lat, lng });
        try {
          const toilets = await fetchToilets();
          const active = toilets.filter((t) => t.is_active);
          setAllToilets(active);
          const withDist = active
            .map((t) => ({ ...t, distanceKm: getDistanceKm(lat, lng, t.lat, t.lng) }))
            .sort((a, b) => a.distanceKm - b.distanceKm);
          const top3 = withDist.slice(0, 3);
          if (top3.length === 0) {
            setStatus("empty");
          } else {
            setNearest(top3);
            setStatus("results");
          }
        } catch {
          setStatus("error");
        }
      },
      () => setStatus("denied"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const nearestIds = new Set(nearest.map((t) => t.id));

  return (
    <div className="px-4 py-6">
      <button
        onClick={onBack}
        className="text-sm text-gray-400 mb-4 inline-block"
      >
        ← 回首页
      </button>

      {status === "loading" && <LoadingState />}
      {status === "denied" && <ErrorState type="denied" />}
      {status === "error" && <ErrorState type="error" />}
      {status === "empty" && <ErrorState type="empty" onAdd={onAdd} />}

      {status === "results" && (
        <>
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            附近最有希望的 3 个
          </h2>
          <p className="text-sm text-gray-400 mb-5">
            按你当前位置粗略排序，先救急，别太纠结。
          </p>
          {nearest.map((t, i) => (
            <ToiletCard key={t.id} toilet={t} rank={i} />
          ))}
          <MiniMap
            allToilets={allToilets}
            nearestIds={nearestIds}
            bestId={nearest[0]?.id}
            userLat={userPos?.lat}
            userLng={userPos?.lng}
          />
        </>
      )}
    </div>
  );
}

async function fetchToilets(): Promise<Toilet[]> {
  if (!hasSupabase || !supabase) return mockToilets;
  const { data, error } = await supabase
    .from("toilets")
    .select("*")
    .eq("is_active", true);
  if (error) throw error;
  return data ?? mockToilets;
}
