import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Toilet } from "../types";
import { openDirectionsAndTrack } from "../lib/visits";
import { getSubmitterLabel } from "../lib/attribution";
import "leaflet/dist/leaflet.css";

type Props = {
  allToilets: Toilet[];
  nearestIds?: Set<string>;
  bestId?: string;
  userLat?: number;
  userLng?: number;
};

const toiletIcon = L.divIcon({
  html: '<div class="toilet-paper-marker">🧻</div>',
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -14],
});

export default function MiniMap({ allToilets, userLat, userLng }: Props) {
  const center: [number, number] = userLat && userLng
    ? [userLat, userLng]
    : [51.5074, -0.1278];

  return (
    <div className="mt-8 mx-1">
      <div className="map-frame">
        <span className="map-plaque">活命图</span>
        <p
          className="text-[11px] text-center mt-1.5 mb-2.5"
          style={{ color: "var(--soft)" }}
        >
          看看有哪些地方可以承接你这泼天的hmmm意
        </p>
        <div className="rounded-2xl overflow-hidden">
          <MapContainer
            center={center}
            zoom={14}
            style={{ height: "260px", width: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {allToilets.map((t) => {
              const showCode = t.access_type === "需要 code" && t.code;

              return (
                <Marker key={t.id} position={[t.lat, t.lng]} icon={toiletIcon}>
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold">{t.name}</p>
                      <p>{t.access_type}</p>
                      {showCode && <p>你懂的：{t.code}</p>}
                      {t.tip && <p>{t.tip}</p>}
                      <button
                        type="button"
                        onClick={() => openDirectionsAndTrack(t)}
                        className="text-blue-500 underline bg-transparent border-0 p-0 cursor-pointer"
                      >
                        快带朕去
                      </button>
                      <p className="text-[10px] text-gray-400 mt-1">{getSubmitterLabel(t)}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
