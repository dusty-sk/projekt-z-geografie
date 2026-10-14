export type RatingDist = number[]; // length 6, index = rating value 0..5

export function zeros(): RatingDist {
  return [0, 0, 0, 0, 0, 0];
}

export function sumDist(d: RatingDist): number {
  return d.reduce((acc, v) => acc + (v || 0), 0);
}

export function meanFromDist(d: RatingDist): number | null {
  const n = sumDist(d);
  if (n <= 0) return null;
  let total = 0;
  for (let r = 0; r < 6; r++) total += r * (d[r] || 0);
  return total / n;
}

export function pctFromDist(d: RatingDist): number[] {
  const n = sumDist(d);
  if (n <= 0) return zeros();
  return d.map((v) => (v || 0) / n);
}

export function maxMin(d: RatingDist): { max: number | null; min: number | null } {
  if (sumDist(d) <= 0) return { max: null, min: null };
  let max = -1;
  let min = 10;
  for (let r = 0; r < 6; r++) {
    const c = d[r] || 0;
    if (c > 0) {
      if (r > max) max = r;
      if (r < min) min = r;
    }
  }
  return { max: max < 0 ? null : max, min: min > 5 ? null : min };
}
