import { useParams } from "react-router-dom";
import { LocationDetail } from "../components/location/LocationDetail";
import { Button } from "../components/Button";
import { getLocation } from "../data/locations";

/**
 * Route: /miesta/:slug
 * Renders the shared detail template for whichever location matches the slug.
 * The map, the catalogue and any future link all point here, so a location is
 * only ever defined once — in src/data/locations.ts.
 */
export function PlaceProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const location = getLocation(slug);

  if (!location) {
    return (
      <section className="section" style={{ paddingTop: "calc(var(--nav-h) + 5rem)" }}>
        <div className="shell shell--narrow">
          <p className="eyebrow">Miesta</p>
          <h1 className="cta__title">Táto lokalita tu nie je</h1>
          <p className="cta__body">
            Odkaz mieri na miesto, ktoré v databáze neexistuje alebo bolo medzitým
            odstránené. Vráťte sa prosím do katalógu miest.
          </p>
          <div style={{ marginTop: "1.75rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Button to="/miesta" variant="primary">
              Všetky miesta
            </Button>
            <Button to="/mapa" variant="ghost">
              Späť na mapu
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return <LocationDetail location={location} />;
}
