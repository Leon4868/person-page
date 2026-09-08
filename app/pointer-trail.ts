export type TrailPoint = { x: number; y: number };

export const TRAIL_SPACING = 72;
export const MAX_TRAIL_SAMPLES = 2;

export function trailSamples(
  from: TrailPoint,
  to: TrailPoint,
  spacing = TRAIL_SPACING,
  maxSamples = MAX_TRAIL_SAMPLES,
): TrailPoint[] {
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  if (distance < spacing || spacing <= 0 || maxSamples <= 0) return [];

  const count = Math.min(maxSamples, Math.floor(distance / spacing));
  return Array.from({ length: count }, (_, index) => {
    const progress = (index + 1) / count;
    return {
      x: from.x + (to.x - from.x) * progress,
      y: from.y + (to.y - from.y) * progress,
    };
  });
}
