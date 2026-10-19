import { Link } from "react-router-dom";
import { site, footerColumns, sourceNotes } from "../data/site";
import { photoCredits } from "../data/imageCredits";
import { Sea } from "./Sea";
import { useEggs } from "../eggs/EggsContext";
import { ConstellationStar } from "../eggs/Constellation";
import "./Footer.css";

export function Footer() {
  const creditCount = Object.keys(photoCredits).length;
  const { openEgg } = useEggs();

  return (
    <footer className="footer">
      <Sea className="footer__sea" />
      <div className="shell">
        <div className="footer__top">
          <div className="footer__brand">
            <p className="footer__wordmark">{site.name}</p>
            <p className="footer__tagline">{site.tagline}</p>
            <p className="footer__desc">{site.description}</p>
          </div>

          {footerColumns.map((column) => (
            <nav className="footer__col" key={column.title} aria-label={column.title}>
              <h2 className="footer__col-title">{column.title}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link className="footer__link" to={link.to}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="footer__sources">
          <h2 className="footer__col-title">Zdroje a poznámky</h2>
          <ul>
            {sourceNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
            <li>
              Fotografie: {creditCount} snímkov z Wikimedia Commons pod licenciou CC BY-SA —
              autori uvedení pri jednotlivých snímkach.
            </li>
          </ul>
        </div>

        <div className="footer__bottom">
          <p>
            © {site.currentYear} {site.name} · {site.credit}
          </p>
          <div className="footer__signs">
            <button
              type="button"
              className="footer__archive"
              data-egg-trigger="archive"
              title="Lost Archive"
              aria-label="Otvoriť stratený archív"
              onClick={() => openEgg("archive")}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 7.5h16M6.5 7.5V19h11V7.5M9.5 4h5v3.5h-5zM9.5 11.5h5M9.5 14.5h5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <ConstellationStar index={5} />
          </div>
          <p className="footer__coords">
            {site.town} · {site.coordinatesLabel}
          </p>
        </div>
      </div>
    </footer>
  );
}
