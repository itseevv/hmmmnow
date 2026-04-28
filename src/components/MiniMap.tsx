import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Toilet } from "../types";
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
    <div className="mt-6 px-1">
      <h3 className="text-base font-semibold text-gray-700 mb-1">附近地图</h3>
      <p className="text-xs text-gray-400 mb-3">
        点一下图标，看看能不能救你。
      </p>
      <div className="rounded-2xl overflow-hidden shadow-md">
        <MapContainer
          center={center}
          zoom={14}
          style={{ height: "280px", width: "100%" }}
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
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${t.lat},${t.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      带我过去
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
