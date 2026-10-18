import { PageHeader } from "../components/PageHeader";
import { ComingContent } from "../components/ComingContent";
import { aboutPage } from "../data/underConstruction";

export function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow={aboutPage.eyebrow}
        title={aboutPage.title}
        lede={aboutPage.lede}
        meta={aboutPage.meta}
        image={{ slug: "detva-stara-cast.jpg" }}
      />
      <ComingContent
        intro={aboutPage.intro}
        items={aboutPage.items}
        backTo={{ label: "Preskúmať mapu", to: "/mapa" }}
      />
    </>
  );
}
