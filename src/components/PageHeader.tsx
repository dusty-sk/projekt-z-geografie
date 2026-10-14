import { Reveal } from "./Reveal";
import { AppImage } from "./AppImage";
import { creditLine } from "../data/imageCredits";
import "./PageHeader.css";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  lede: string;
  image?: { slug: string };
  meta?: readonly { label: string; value: string }[];
};

export function PageHeader({ eyebrow, title, lede, image, meta }: PageHeaderProps) {
  return (
    <header className="ph">
      {image && (
        <div className="ph__media" aria-hidden="true">
          <AppImage slug={image.slug} alt="" loading="eager" decoding="async" />
          <div className="ph__scrim" />
        </div>
      )}

      <div className="ph__inner shell">
        <Reveal className="ph__content">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="ph__title">{title}</h1>
          <p className="ph__lede">{lede}</p>
        </Reveal>

        {meta && (
          <Reveal delay={120} className="ph__meta">
            <ul>
              {meta.map((item) => (
                <li key={item.label}>
                  <span className="ph__meta-label">{item.label}</span>
                  <span className="ph__meta-value">{item.value}</span>
                </li>
              ))}
            </ul>
            {image && <p className="ph__credit">{creditLine(image.slug)}</p>}
          </Reveal>
        )}
      </div>
    </header>
  );
}
