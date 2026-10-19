import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { MapPage } from "./pages/MapPage";
import { PlacesPage } from "./pages/PlacesPage";
import { PlaceProfilePage } from "./pages/PlaceProfilePage";
import { ResearchPage } from "./pages/ResearchPage";
import { SurveyPage } from "./pages/SurveyPage";
import { ResultsPage } from "./pages/ResultsPage";
import { RegionPage } from "./pages/RegionPage";
import { RegionalResearchPage } from "./pages/RegionalResearchPage";
import { AboutPage } from "./pages/AboutPage";
import { PresentationProvider } from "./presentation/PresentationContext";
import { EggsProvider } from "./eggs/EggsContext";
import { EggsLayer } from "./eggs/EggsLayer";

export function App() {
  return (
    <PresentationProvider>
      <EggsProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="mapa" element={<MapPage />} />
            <Route path="miesta" element={<PlacesPage />} />
            <Route path="miesta/:slug" element={<PlaceProfilePage />} />
            <Route path="vyskum" element={<ResearchPage />} />
            <Route path="prieskum" element={<SurveyPage />} />
            <Route path="vysledky-prieskumu" element={<ResultsPage />} />
            <Route path="region" element={<RegionPage />} />
            <Route path="regionalny-vyskum" element={<RegionalResearchPage />} />
            <Route path="o-projekte" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <EggsLayer />
      </EggsProvider>
    </PresentationProvider>
  );
}
