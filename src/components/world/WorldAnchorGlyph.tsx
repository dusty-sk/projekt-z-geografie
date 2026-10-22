import type { WorldAnchorId } from "../../data/world";

export function WorldAnchorGlyph({ id }: { id: WorldAnchorId }) {
  switch (id) {
    case "tichy-pastier":
      return (
        <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <circle cx="20" cy="12" r="4.4" />
          <path d="M15.5 12 C17 8.8 22.8 8.6 24.5 12" />
          <path d="M18.5 16.5 L17 25 L10.5 33 M18.5 25 L24.5 32.5 M18.5 20 L26.5 16.5" />
          <path d="M28.5 36 C28 27.5 28 19.5 31 11.5 M28 11.5 C26.8 10.2 26.3 9 26.5 7.6" />
          <path d="M5 36 C6.5 32.2 11 31.5 14 34.4 C11.2 37.4 7.4 38.2 5 36 Z" />
        </svg>
      );
    case "bystry-had":
      return (
        <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <path d="M7 35 C12.5 27 19 37 24.5 29 C29.5 22 27 16 21.5 16.5 C17 17 16.2 22 21 23.2 C25.3 24.3 30.5 20.5 33.5 14.5" />
          <path d="M33.5 14.5 L37.2 14 L36.4 17.4" />
          <circle cx="35" cy="14.2" r="0.8" fill="currentColor" stroke="none" />
          <path d="M37.2 14 L41 12.8 M37.2 14 L41 15.3" />
        </svg>
      );
    case "skalny-vtak":
      return (
        <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <path d="M11 28 C14.5 18.5 22.5 13.8 29 17.2 C33.4 19.6 34.1 24.4 31 27.5 L35.5 30.5 L29.5 30.2 C27.2 33.7 22 35 18.3 32.8 L15 37 L15.2 31.5 C13.2 30.8 11.7 29.6 11 28 Z" />
          <path d="M29 17.2 L35 13.8 L33.3 20" />
          <path d="M18 33.5 L17 39 M23 34.5 L23 40" />
          <circle cx="27.5" cy="21.5" r="0.75" fill="currentColor" stroke="none" />
        </svg>
      );
    case "machovy-chodec":
      return (
        <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <path d="M12.5 37.5 C14 29.5 19 25 25.5 28 C29 23.5 36 25.5 36 31.5 L39 37 L34.5 35.5 L35.5 39 L30.5 37.5 L28.5 40 L26.5 35 C21.5 35.5 16 39 12.5 37.5 Z" />
          <circle cx="31.5" cy="23.5" r="4.1" />
          <path d="M30 20 C27.5 16 28.5 12.5 31.5 10.5 M33.5 20 C36 16 39 14.5 42 15.5" />
          <path d="M29 23 L30 23 M33 23 L34 23" />
          <path d="M18 35 C20 32 22 30 25 29" />
        </svg>
      );
    case "dreveny-svedok":
      return (
        <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <path d="M22 9 L22 40 M11 18 L33 18" />
          <circle cx="22" cy="18" r="5.2" />
          <path d="M15.5 11 L12 6.5 M28.5 11 L32 6.5" />
          <path d="M19.8 17.2 L20.6 17.2 M23.4 17.2 L24.2 17.2" />
          <path d="M19 20.3 C20.8 21.8 23.2 21.8 25 20.3" />
        </svg>
      );
  }
}
