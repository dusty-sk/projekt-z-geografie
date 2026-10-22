import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AtmosphereBackground } from "./atmosphere/AtmosphereBackground";
import { PresentationBar } from "../presentation/PresentationBar";
import { usePresentationKeys } from "../presentation/usePresentationKeys";

/**
 * Exposes the pointer position as CSS custom properties so the ambient dot
 * layer can brighten the dots nearest the cursor. Decorative only: it runs on
 * hover-capable pointers, writes at most once per frame, and never blocks input.
 */
function useAmbientProximity() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    const root = document.documentElement;
    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      root.style.setProperty("--cursor-x", `${x}px`);
      root.style.setProperty("--cursor-y", `${y}px`);
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      root.classList.add("is-pointer-active");
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const onLeave = () => root.classList.remove("is-pointer-active");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("blur", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
      root.classList.remove("is-pointer-active");
      root.style.removeProperty("--cursor-x");
      root.style.removeProperty("--cursor-y");
    };
  }, []);
}

/** Sends focus to the top of the document and resets scroll on route change. */
function useRouteEffects() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      document.getElementById("main")?.focus({ preventScroll: true });
    }, 0);
    return () => window.clearTimeout(id);
  }, [pathname]);
}

export function Layout() {
  useRouteEffects();
  useAmbientProximity();
  usePresentationKeys();
  const { pathname } = useLocation();

  return (
    <>
      <a className="skip-link" href="#main">
        Preskočiť na obsah
      </a>
      <PresentationBar />
      <Navbar />
      <div className="ambient" aria-hidden="true" />
      {!pathname.startsWith("/svet") && <AtmosphereBackground />}
      <main id="main" tabIndex={-1}>
        {/* Keyed by route so each page gets one short, restrained entrance. */}
        <div key={pathname} className="page-transition">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
}
