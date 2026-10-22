import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { atmosphereAnchors, type AtmosphereAnchor } from "../../data/world";
import { AtmosphereLandscape } from "./AtmosphereLandscape";
import {
  forcedPresetFromSearch,
  getPresetForSection,
  sectionKeyForPath,
  type AtmospherePreset,
} from "./AtmospherePresets";
import "./AtmosphereBackground.css";

type AtmosphereBackgroundProps = {
  renderAnchor?: (anchor: AtmosphereAnchor) => ReactNode;
};

type Selection = {
  key: string;
  preset: AtmospherePreset;
};

export function AtmosphereBackground({ renderAnchor }: AtmosphereBackgroundProps) {
  const { pathname, search } = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const sectionKey = sectionKeyForPath(pathname);
  const forcedPreset = forcedPresetFromSearch(search);
  const selectionKey = `${sectionKey}:${forcedPreset?.id ?? "random"}`;
  const selectionRef = useRef<Selection | null>(null);

  if (!selectionRef.current) {
    selectionRef.current = {
      key: selectionKey,
      preset: forcedPreset ?? getPresetForSection(sectionKey),
    };
  }

  const [selection, setSelection] = useState<Selection>(selectionRef.current);

  useLayoutEffect(() => {
    if (selection.key === selectionKey) return;

    setSelection({
      key: selectionKey,
      preset: forcedPreset ?? getPresetForSection(sectionKey),
    });
  }, [forcedPreset, sectionKey, selection.key, selectionKey]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      node.style.setProperty("--atmo-scroll", progress.toFixed(4));
    };
    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);

    const observer = new ResizeObserver(request);
    observer.observe(document.body);

    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`atmosphere atmosphere--${selection.preset.phase}`}
      data-phase={selection.preset.phase}
      data-bg={selection.preset.id}
    >
      <div className="atmosphere__visual" aria-hidden="true">
        <AtmosphereLandscape />
        <div className="atmosphere__shade" />
      </div>

      <div className="atmosphere__anchors">
        {atmosphereAnchors.map((anchor) => (
          <div
            key={anchor.id}
            className={`atmosphere__anchor atmosphere__anchor--${anchor.layer}`}
            data-anchor-id={anchor.id}
            data-anchor-layer={anchor.layer}
            data-anchor-x={anchor.x}
            data-anchor-y={anchor.y}
            style={{ left: `${anchor.x}%`, top: `${anchor.y}%` }}
          >
            {renderAnchor?.(anchor)}
          </div>
        ))}
      </div>
    </div>
  );
}
