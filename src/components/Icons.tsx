/** The spiral of the project mark, drawn as a small orbiting glyph. */
export function SpiralMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12 12a2 2 0 0 1 2 2 3 3 0 0 1-3 3 4 4 0 0 1-4-4 5 5 0 0 1 5-5 6 6 0 0 1 6 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Simple "expand" glyph used by the gallery zoom controls. */
export function ZoomIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        d="M4 9V4h5M20 15v5h-5M15 4h5v5M9 20H4v-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
