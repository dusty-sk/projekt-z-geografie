import { useState } from "react";
import { imageUrl } from "../data/imageCredits";
import "./AppImage.css";

/**
 * Inline SVG placeholder shown when a referenced file is missing on disk.
 * Kept as a data URI so the element stays an <img> — every existing layout,
 * aspect-ratio and object-fit rule therefore keeps working untouched.
 */
const FALLBACK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">' +
  '<rect width="320" height="200" fill="#0b1424"/>' +
  '<path d="M32 158 L104 84 L152 132 L190 96 L288 158 Z" fill="none" stroke="#43506b" stroke-width="5" stroke-linejoin="round"/>' +
  '<circle cx="236" cy="62" r="18" fill="none" stroke="#43506b" stroke-width="5"/>' +
  "</svg>";

const FALLBACK_SRC = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(FALLBACK_SVG)}`;

export type AppImageProps = {
  /** Image slug from the central dataset / public/images/credits.json. */
  slug: string;
  /** Descriptive alt text (empty string for purely decorative images). */
  alt?: string;
  className?: string;
  loading?: "eager" | "lazy";
  decoding?: "async" | "sync" | "auto";
  fetchPriority?: "high" | "low" | "auto";
};

/**
 * Single image primitive for the whole site. It resolves the slug to a served
 * path and swaps in a neutral placeholder if the file cannot be loaded, so a
 * missing photograph never leaves a broken-image icon on the page. Existing
 * CSS that targets `img` keeps applying because the element never changes tag.
 */
export function AppImage({
  slug,
  alt = "",
  className,
  loading = "lazy",
  decoding = "async",
  fetchPriority,
}: AppImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <img
      className={className}
      src={failed ? FALLBACK_SRC : imageUrl(slug)}
      alt={alt}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      data-fallback={failed ? "true" : undefined}
      onError={() => setFailed((previous) => previous || true)}
    />
  );
}
