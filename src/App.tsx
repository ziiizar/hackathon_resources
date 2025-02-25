import { Routes, Route, useRoutes } from "react-router-dom";
import ConfirmEmail from "./components/auth/ConfirmEmail";
import Home from "./components/home";
import Resources from "./components/Resources";
import About from "./components/About";
import Contact from "./components/Contact";
import ProfilePage from "./components/profile/ProfilePage";
import CollectionDetail from "./components/collections/CollectionDetail";
import routes from "tempo-routes";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <>
      {/* For the tempo routes */}
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="profile/:id" element={<ProfilePage />} />
        <Route path="collection/:id" element={<CollectionDetail />} />
        <Route path="auth/confirm" element={<ConfirmEmail />} />

        {/* Add this before the catchall route */}
        {import.meta.env.VITE_TEMPO === "true" && <Route path="/tempobook/*" />}
      </Routes>
      <Analytics />
      <Toaster />
    </>
  );
}

export default App;
