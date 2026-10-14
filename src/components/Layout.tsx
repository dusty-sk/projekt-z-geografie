import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

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
  const { pathname } = useLocation();

  return (
    <>
      <a className="skip-link" href="#main">
        Preskočiť na obsah
      </a>
      <Navbar />
      <div className="ambient" aria-hidden="true" />
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
