import { Link } from "react-router-dom";
import { site, footerColumns, sourceNotes } from "../data/site";
import { photoCredits } from "../data/imageCredits";
import "./Footer.css";

export function Footer() {
  const creditCount = Object.keys(photoCredits).length;

  return (
    <footer className="footer">
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
            © {site.currentYear} {site.name} · {site.projectType}
          </p>
          <p className="footer__coords">
            {site.town} · {site.coordinatesLabel}
          </p>
        </div>
      </div>
    </footer>
  );
}
