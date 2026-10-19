import { useNavigate } from "react-router-dom";
import { EggModal } from "./EggModal";
import { useEggs } from "./EggsContext";

type ArchiveActionId = "terminal" | "map" | "glitch" | "midnight";

type ArchiveDocument = {
  index: string;
  kind: string;
  title: string;
  meta: string;
  body: string;
  hint: string;
  action?: { label: string; id: ArchiveActionId };
};

const archiveDocuments: readonly ArchiveDocument[] = [
  {
    index: "01",
    kind: "Poznámka",
    title: "Sedem zaklopaní",
    meta: "bez dátumu · rukopis",
    body:
      "Kto zaklope na znak mesta sedemkrát, tomu sa otvorí konzola. Nie je to diera v mure — je to diera v zázname.",
    hint: "Klikni na logo v hornej lište. Sedemkrát.",
    action: { label: "Otvoriť terminál", id: "terminal" },
  },
  {
    index: "02",
    kind: "Fiktívny záznam",
    title: "Bod, ktorý nie je v zozname",
    meta: "mapa · vrstva 11",
    body:
      "Katalóg priznáva desať miest. Mapa má o jeden bod viac. Keď naň klikneš, priblíži sa prázdne miesto a archív dopíše, čo si videl.",
    hint: "Na mape hľadaj tichý bod mimo ostatných značiek.",
    action: { label: "Prejsť na mapu", id: "map" },
  },
  {
    index: "03",
    kind: "Nevyriešená záhada",
    title: "Porucha v zrkadle",
    meta: "2 sekundy · bez následkov",
    body:
      "Niekedy sa text na dve sekundy rozdelí, ornamenty sa posunú a za kurzorom zostane digitálna stopa. Potom sa všetko vráti. Nič sa nepokazí.",
    hint: "Stačí príkaz glitch v termináli — alebo veľká náhoda.",
    action: { label: "Spustiť poruchu", id: "glitch" },
  },
  {
    index: "04",
    kind: "Poznámka",
    title: "Päť svetiel",
    meta: "ornamenty · poradie",
    body:
      "Päť drobných iskier je roztrúsených po stránkach. Poradie nie je náhodné: od domu k pätke.",
    hint: "Domov → mapa → výskum → o projekte → pätka. Každé svetlo raz.",
  },
  {
    index: "05",
    kind: "Fiktívny záznam",
    title: "Kód z roku 1987",
    meta: "klávesnica · ↑ ↑ ↓ ↓ ← → ← →",
    body:
      "V starej učebni vraj koloval kód, ktorý otváral vývojársky režim. FPS je skutočné; návštevy sú vymyslené. Tak to má byť.",
    hint: "↑ ↑ ↓ ↓ ← → ← → na ľubovoľnej stránke.",
  },
  {
    index: "06",
    kind: "Nevyriešená záhada",
    title: "Minúta po polnoci",
    meta: "00:00 · lokálny čas",
    body:
      "Kto otvorí stránku presne o polnoci, uvidí mesto v inej tme. Ornamenty začnú svietiť a archív pošepká vetu, ktorú cez deň nehovorí.",
    hint: "Otvor stránku o 00:00 alebo použi príkaz polnoc.",
    action: { label: "Spustiť nočný protokol", id: "midnight" },
  },
  {
    index: "07",
    kind: "Poznámka",
    title: "Sieť, ktorá nie je na mape",
    meta: "päť uzlov · prepojenia",
    body:
      "Medzi textami sú tri body spojené tenkou čiarou. Každý drží inú časť siete. Keď nájdeš všetkých päť, archív ukáže prepojenia, ktoré v bežnom režime neexistujú.",
    hint: "Domov, mapa, miesta, región, o projekte.",
  },
];

export function LostArchive() {
  const {
    closeEgg,
    openEgg,
    triggerGlitch,
    activateMidnight,
    unlocked,
    unlockedCount,
    constellationStep,
    networkFound,
  } = useEggs();
  const navigate = useNavigate();

  const runAction = (id: ArchiveActionId) => {
    switch (id) {
      case "terminal":
        openEgg("terminal");
        break;
      case "map":
        closeEgg();
        navigate("/mapa");
        break;
      case "glitch":
        closeEgg();
        triggerGlitch();
        break;
      case "midnight":
        activateMidnight();
        break;
    }
  };

  return (
    <EggModal
      titleId="egg-archive-title"
      label="LOST ARCHIVE · 7 dokumentov"
      className="egg-archive-shell"
      onClose={closeEgg}
      wide
    >
      <div className="egg-archive">
        <p className="egg-eyebrow">Nájdené vrstvy · {unlockedCount}/10</p>
        <h2 id="egg-archive-title" className="egg-title">
          LOST ARCHIVE
        </h2>
        <p className="egg-lede">
          Sedem dokumentov, ktoré sa do bežného katalógu nedostali. Každý drží stopu
          k inej vrstve tohto webu.
        </p>

        <div className="egg-archive__grid">
          {archiveDocuments.map((doc) => (
            <article key={doc.index} className="egg-archive__doc" data-egg-doc={doc.index}>
              <header className="egg-archive__doc-head">
                <span>
                  {doc.index} · {doc.kind}
                </span>
                <span>{doc.meta}</span>
              </header>
              <h3 className="egg-archive__doc-title">{doc.title}</h3>
              <p className="egg-archive__doc-body">{doc.body}</p>
              <p className="egg-archive__doc-hint">{doc.hint}</p>
              {doc.action && (
                <button
                  type="button"
                  className="egg-button egg-archive__doc-action"
                  data-egg-action={doc.action.id}
                  onClick={() => runAction(doc.action!.id)}
                >
                  {doc.action.label}
                </button>
              )}
            </article>
          ))}
        </div>

        <div className="egg-archive__foot">
          <p className="egg-archive__progress">
            Súhvezdie {constellationStep}/5 · sieť {networkFound.length}/5
          </p>
          <div className="egg-archive__replay">
            {constellationStep >= 5 && (
              <button type="button" className="egg-button" onClick={() => openEgg("constellation")}>
                Zobraziť súhvezdie
              </button>
            )}
            {networkFound.length >= 5 && (
              <button type="button" className="egg-button" onClick={() => openEgg("network")}>
                Otvoriť sieť
              </button>
            )}
            {unlocked.completionist && (
              <button
                type="button"
                className="egg-button"
                onClick={() => openEgg("completionist")}
              >
                Záverečný záznam
              </button>
            )}
          </div>
        </div>

        <p className="egg-note">
          Celý archív je fiktívny — je súčasťou skrytej hry, nie zdrojom faktov o Detve.
        </p>
      </div>
    </EggModal>
  );
}
