const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function careerFrame(centers: number[], anchor: number, range: number) {
  if (!centers.length) return { active: 0, progress: 0, cards: [] };
  let active = 0;
  centers.forEach((center, i) => { if (Math.abs(center - anchor) < Math.abs(centers[active] - anchor)) active = i; });
  const span = centers[centers.length - 1] - centers[0];
  return {
    active,
    progress: span > 0 ? clamp((anchor - centers[0]) / span) : 0,
    cards: centers.map(center => {
      const distance = clamp((center - anchor) / Math.max(range, 1), -1, 1);
      const focus = 1 - Math.abs(distance);
      return { scale: .94 + focus * .06, rotate: distance * -3.5, depth: -40 * Math.abs(distance), opacity: .68 + focus * .32 };
    }),
  };
}
