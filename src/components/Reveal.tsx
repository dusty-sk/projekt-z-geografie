import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import "./Reveal.css";

type RevealVariant = "up" | "fade" | "scale" | "left" | "right";

type RevealProps = {
  children: ReactNode;
  /** Stagger delay in ms, applied after the element becomes visible. */
  delay?: number;
  /** Distance the element travels upward, in px (overrides the variant). */
  y?: number;
  /** Horizontal travel in px (overrides the variant). */
  x?: number;
  /** Entrance scale (overrides the variant). */
  scale?: number;
  /** Direction / character of the entrance. Defaults to a small upward rise. */
  variant?: RevealVariant;
  as?: ElementType;
  className?: string;
  id?: string;
};

/** Tracks the OS-level reduced-motion preference. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

/**
 * Fades/slides content in the first time it enters the viewport.
 * Falls back to an immediately-visible state when reduced motion is requested
 * or when IntersectionObserver is unavailable.
 */
export function Reveal({
  children,
  delay = 0,
  y,
  x,
  scale,
  variant = "up",
  as: Tag = "div",
  className,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  const offsetY = y ?? (variant === "fade" ? 8 : variant === "up" ? 22 : 0);
  const offsetX = x ?? (variant === "left" ? -28 : variant === "right" ? 28 : 0);
  const entranceScale = scale ?? (variant === "scale" ? 0.96 : 1);

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <Tag
      id={id}
      ref={ref}
      className={`reveal${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={
        {
          "--reveal-delay": `${delay}ms`,
          "--reveal-x": `${offsetX}px`,
          "--reveal-y": `${offsetY}px`,
          "--reveal-scale": `${entranceScale}`,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
