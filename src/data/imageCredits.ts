import creditsJson from "../../public/images/credits.json";

export type PhotoCredit = {
  title: string;
  thumb: string;
  width: number;
  height: number;
  license: string;
  artist: string;
  desc: string;
  page: string;
  bytes?: number;
};

const raw = creditsJson as Record<string, PhotoCredit>;

export const photoCredits: Record<string, PhotoCredit> = raw;

/** Absolute (public) path for a local image slug. */
export function imageUrl(slug: string): string {
  return `${import.meta.env.BASE_URL}images/${slug}`;
}

export function creditFor(slug: string): PhotoCredit | undefined {
  return raw[slug];
}

/** Alt text derived from the Commons description, trimmed and Slovak-ised enough for captions. */
export function creditLine(slug: string): string {
  const c = raw[slug];
  if (!c) return "";
  return `${c.artist} / Wikimedia Commons · ${c.license}`;
}
