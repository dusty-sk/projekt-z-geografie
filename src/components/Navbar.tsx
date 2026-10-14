import { useEffect, useRef, useState, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { primaryNav } from "../data/navigation";
import { site } from "../data/site";
import { usePrefersReducedMotion } from "./Reveal";
import "./Navbar.css";

/** True once the page has scrolled past the transparent-hero threshold. */
function useScrolled(threshold = 28) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > threshold);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);
  return scrolled;
}

export function Navbar() {
  const { pathname } = useLocation();
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const reduced = usePrefersReducedMotion();

  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Only the landing page starts with a transparent bar sitting over the hero.
  const overHero = pathname === "/" && !scrolled && !open;

  const close = useCallback(() => setOpen(false), []);

  // Close the menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // Lock background scroll while the mobile panel is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Esc closes; Tab is trapped inside the open panel.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    // Move focus into the panel.
    const id = window.setTimeout(() => closeRef.current?.focus(), reduced ? 0 : 220);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(id);
    };
  }, [open, reduced]);

  return (
    <header className={`nav${overHero ? " nav--over" : " nav--solid"}${open ? " is-open" : ""}`}>
      <div className="nav__inner shell">
        <NavLink to="/" className="nav__brand" aria-label={`${site.name} — domov`}>
          <span className="nav__mark" aria-hidden="true" />
          <span className="nav__wordmark">{site.name}</span>
        </NavLink>

        <nav className="nav__links" aria-label="Hlavná navigácia">
          <ul>
            {primaryNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) => `nav__link${isActive ? " is-active" : ""}`}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-panel"
          aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav__toggle-box" aria-hidden="true">
            <span className="nav__toggle-bar" />
            <span className="nav__toggle-bar" />
          </span>
        </button>
      </div>

      <div
        id="nav-panel"
        ref={panelRef}
        className="nav__panel"
        hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="nav__panel-inner shell">
          <button
            ref={closeRef}
            type="button"
            className="nav__close"
            onClick={close}
            aria-label="Zavrieť menu"
          >
            <span aria-hidden="true">Zavrieť</span>
          </button>

          <ul className="nav__panel-list">
            {primaryNav.map((item, index) => (
              <li key={item.to} style={{ transitionDelay: `${reduced ? 0 : 60 + index * 45}ms` }}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `nav__panel-link${isActive ? " is-active" : ""}`
                  }
                  tabIndex={open ? 0 : -1}
                >
                  <span className="nav__panel-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <p className="nav__panel-meta">{site.region} · {site.town}</p>
        </div>
      </div>
    </header>
  );
}
