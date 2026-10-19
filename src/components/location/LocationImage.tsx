import { AppImage } from "../AppImage";
import { ZoomIcon } from "../Icons";
import { creditFor } from "../../data/imageCredits";
import type { LocationImage as LocationImageData } from "../../data/locations";

type LocationImageProps = {
  image: LocationImageData;
  className?: string;
  /** Load eagerly for above-the-fold images. */
  priority?: boolean;
  /** Optional override for the visible caption. */
  caption?: string;
  /** When provided, renders an accessible control that opens the lightbox. */
  onZoom?: () => void;
};

/**
 * Renders a photograph together with an honest provenance label:
 * illustrative images are clearly badged so they are never mistaken
 * for a direct photograph of the location.
 */
export function LocationImage({
  image,
  className,
  priority = false,
  caption,
  onZoom,
}: LocationImageProps) {
  const credit = creditFor(image.slug);
  const cls = ["loc-figure", className].filter(Boolean).join(" ");

  return (
    <figure className={cls}>
      <div className="loc-figure__frame">
        <AppImage
          slug={image.slug}
          alt={image.alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
        {image.kind === "illustrative" && (
          <span className="loc-figure__badge">Ilustračné</span>
        )}
        {onZoom && (
          <button
            type="button"
            className="loc-figure__zoom"
            onClick={onZoom}
            aria-label={`Zväčšiť fotografiu: ${caption ?? image.alt}`}
          >
            <span className="loc-figure__zoom-badge" aria-hidden="true">
              <ZoomIcon />
            </span>
          </button>
        )}
      </div>
      <figcaption className="loc-figure__caption">
        <span className="loc-figure__desc">{caption ?? image.alt}</span>
        {image.kind === "illustrative" && image.note && (
          <span className="loc-figure__note">{image.note}</span>
        )}
        {credit && (
          <span className="loc-figure__credit">
            {credit.artist} / Wikimedia Commons · {credit.license}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
