export function getDistanceKm(
  userLat: number,
  userLng: number,
  toiletLat: number,
  toiletLng: number
): number {
  const R = 6371;
  const dLat = ((toiletLat - userLat) * Math.PI) / 180;
  const dLng = ((toiletLng - userLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((userLat * Math.PI) / 180) *
      Math.cos((toiletLat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

export function walkingTime(km: number): string {
  const mins = Math.round((km / 5) * 60);
  return `约 ${mins} 分钟 · ${formatDistance(km)}`;
}
