import { useEffect, useRef } from "react";
import { AppImage } from "./AppImage";
import "./Lightbox.css";

export type LightboxImage = {
  slug: string;
  alt: string;
  caption?: string;
  credit?: string;
};

type LightboxProps = {
  images: readonly LightboxImage[];
  /** Index of the open image, or null when the lightbox is closed. */
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

/**
 * Minimal, dependency-free image lightbox.
 *
 * Accessibility: role="dialog" + aria-modal, Escape to close, ←/→ to navigate,
 * a focus trap, focus restoration and body-scroll locking. Motion is disabled
 * automatically by the global prefers-reduced-motion rule.
 */
export function Lightbox({ images, index, onClose, onIndexChange }: LightboxProps) {
  const open = index !== null && index >= 0 && index < images.length;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Keep the latest index/callbacks for the key handler without re-binding it.
  const indexRef = useRef<number | null>(index);
  indexRef.current = index;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const onIndexRef = useRef(onIndexChange);
  onIndexRef.current = onIndexChange;

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    const onKey = (event: KeyboardEvent) => {
      const count = images.length;
      const current = indexRef.current;
      if (current === null) return;

      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
      } else if (event.key === "ArrowRight" && count > 1) {
        onIndexRef.current((current + 1) % count);
      } else if (event.key === "ArrowLeft" && count > 1) {
        onIndexRef.current((current - 1 + count) % count);
      } else if (event.key === "Tab") {
        const nodes = focusables();
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, images.length]);

  if (!open || index === null) return null;

  const current = images[index];
  const label = current.caption || current.alt || "Fotografia";
  const multiple = images.length > 1;

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={label} ref={dialogRef}>
      <div className="lightbox__backdrop" aria-hidden="true" onClick={onClose} />

      <figure className="lightbox__figure">
        <div className="lightbox__media">
          <AppImage
            slug={current.slug}
            alt={current.alt}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <figcaption className="lightbox__caption">
          {current.caption && <span className="lightbox__title">{current.caption}</span>}
          {current.credit && <span className="lightbox__credit">{current.credit}</span>}
          {multiple && (
            <span className="lightbox__count">
              {index + 1} / {images.length}
            </span>
          )}
        </figcaption>
      </figure>

      <button
        type="button"
        ref={closeRef}
        className="lightbox__close"
        onClick={onClose}
        aria-label="Zavrieť fotografiu"
      />

      {multiple && (
        <>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            onClick={() => onIndexChange((index - 1 + images.length) % images.length)}
            aria-label="Predchádzajúca fotografia"
          />
          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            onClick={() => onIndexChange((index + 1) % images.length)}
            aria-label="Ďalšia fotografia"
          />
        </>
      )}
    </div>
  );
}
