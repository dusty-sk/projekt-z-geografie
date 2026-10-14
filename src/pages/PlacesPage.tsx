import { Link } from "react-router-dom";
import { AppImage } from "../components/AppImage";
import { PageHeader } from "../components/PageHeader";
import { Reveal } from "../components/Reveal";
import {
  locations,
  categoryById,
  type Location,
} from "../data/locations";
import { creditFor } from "../data/imageCredits";
import "./PlacesPage.css";

function groupLabel(location: Location): string {
  return location.categories.map((id) => categoryById(id).label).join(" · ");
}

/**
 * Catalogue of every location in the central dataset. Each row links to the
 * shared profile page at /miesta/<id>.
 */
export function PlacesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Miesta"
        title="Lokality, ktoré formujú Podpoľanie"
        lede="Výber miest regiónu — prírodných, kultúrnych aj historických — s popisom, kontextom a poznámkami k overeniu."
        meta={[
          { label: "Lokalít v databáze", value: String(locations.length) },
          { label: "Kategórie", value: "Príroda · Kultúra · História · Rekreácia" },
        ]}
        image={{ slug: "detvianska-huta.jpg" }}
      />

      <section className="section places ornament ornament--corners-tlbr" aria-label="Zoznam lokalít">
        <div className="shell">
          <ul className="places__list">
            {locations.map((location, index) => {
              const credit = creditFor(location.hero.slug);
              return (
                <li key={location.id}>
                  <Reveal delay={(index % 4) * 60}>
                    <Link className="place-row" to={`/miesta/${location.id}`}>
                      <span className="place-row__index" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="place-row__media">
                        <AppImage
                          slug={location.hero.slug}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                        {location.hero.kind === "illustrative" && (
                          <span className="place-row__badge">Ilustračné</span>
                        )}
                      </span>

                      <span className="place-row__body">
                        <span className="place-row__group">{groupLabel(location)}</span>
                        <span className="place-row__name">{location.name}</span>
                        <span className="place-row__summary">{location.summary}</span>
                        <span className="place-row__source">
                          {location.scope.municipality}
                          {location.scope.withinDetva ? "" : " (mimo mesta Detva)"} · okres{" "}
                          {location.scope.district} ·{" "}
                          {location.coordSource
                            ? `súradnice: ${location.coordSource}`
                            : "súradnice neuvedené"}
                          {credit ? ` · foto ${credit.artist}` : ""}
                        </span>
                      </span>

                      <span className="place-row__cta" aria-hidden="true">
                        Otvoriť
                        <span className="place-row__arrow" />
                      </span>
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
