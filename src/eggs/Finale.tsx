import { EggModal } from "./EggModal";
import { useEggs } from "./EggsContext";
import { secretLocation } from "../data/secretLocation";

const BADGE_DOTS = Array.from({ length: 10 }, (_, index) => {
  const angle = (Math.PI * 2 * index) / 10 - Math.PI / 2;
  return {
    x: 60 + 46 * Math.cos(angle),
    y: 60 + 46 * Math.sin(angle),
    delay: index * 0.12,
  };
});

export function CompletionistScreen() {
  const { closeEgg } = useEggs();

  return (
    <EggModal
      titleId="egg-completionist-title"
      label="ARCHIVE COMPLETE · 10/10"
      className="egg-completionist-shell"
      onClose={closeEgg}
    >
      <div className="egg-completionist">
        <div className="egg-completionist__badge">
          <svg viewBox="0 0 120 120" role="img" aria-label="Odznak za nájdenie všetkých desiatich vrstiev">
            <circle className="egg-completionist__badge-ring" cx="60" cy="60" r="54" />
            <circle className="egg-completionist__badge-ring egg-completionist__badge-ring--inner" cx="60" cy="60" r="39" />
            {BADGE_DOTS.map((dot, index) => (
              <circle
                key={index}
                className="egg-completionist__badge-dot"
                cx={dot.x}
                cy={dot.y}
                r="2.5"
                style={{ animationDelay: `${dot.delay}s` }}
              />
            ))}
            <path
              className="egg-completionist__badge-spiral"
              d="M60 60c8-8 20-4 21 5 1 10-9 17-18 14-10-3-14-15-8-23 6-9 20-10 28-3 9 8 9 23 0 31-10 9-27 8-36-2"
            />
          </svg>
        </div>

        <p className="egg-eyebrow">10 / 10 · archív dokončený</p>
        <h2 id="egg-completionist-title" className="egg-completionist__title">
          YOU FOUND WHAT WAS NEVER MEANT TO BE FOUND
        </h2>
        <p className="egg-completionist__lede">
          Našiel si všetkých desať vrstiev. Archív ťa teraz vidí — a nechá ťa odísť
          s jednou vetou navyše.
        </p>
        <p className="egg-completionist__message">
          „Mapa sa nikdy nekončí. Zatvor oči, otvor ich a Detva bude mať o jednu
          vrstvu viac.“
        </p>
        <p className="egg-completionist__badge-label">KOMPLETISTA · ODZNAK ULOŽENÝ</p>
        <p className="egg-note">
          Stav odomknutia je uložený v tomto prehliadači. Záverečný záznam sa dá
          znova otvoriť z archívu alebo príkazom finale.
        </p>
      </div>
    </EggModal>
  );
}

export function SecretLocation() {
  const { closeEgg } = useEggs();

  return (
    <EggModal
      titleId="egg-location11-title"
      label="ARCHÍV 11 · nezaradený záznam"
      className="egg-location11-shell"
      onClose={closeEgg}
    >
      <div className="egg-location11">
        <div className="egg-location11__radar" aria-hidden="true">
          <span />
          <span />
          <span />
          <i />
        </div>
        <p className="egg-eyebrow">Mimo katalógu · fiktívny záznam</p>
        <h2 id="egg-location11-title" className="egg-title">
          Bod 11
        </h2>
        <p className="egg-location11__coord">{secretLocation.coordinatesLabel}</p>

        {secretLocation.story.map((paragraph) => (
          <p key={paragraph.slice(0, 32)} className="egg-location11__para">
            {paragraph}
          </p>
        ))}

        <p className="egg-note">{secretLocation.disclaimer}</p>
      </div>
    </EggModal>
  );
}
