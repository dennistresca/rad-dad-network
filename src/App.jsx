import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ShowPage from "./pages/ShowPage";
import PickOfTheDay from "./pages/PickOfTheDay";
import BankrollTracker from "./pages/BankrollTracker";
import CollegeFootballFutures from "./pages/CollegeFootballFutures";
import OurBossThinksWereWorking from "./pages/OurBossThinksWereWorking";
import Store from "./pages/Store";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shows/:slug" element={<ShowPage />} />
            <Route
              path="/shows/dancing-with-the-odds/pick-of-the-day"
              element={<PickOfTheDay />}
            />
            <Route
              path="/shows/dancing-with-the-odds/road-to-10k"
              element={<BankrollTracker />}
            />
            <Route
              path="/shows/dancing-with-the-odds/cfb-futures"
              element={<CollegeFootballFutures />}
            />
            <Route
              path="/our-boss-thinks-were-working"
              element={<OurBossThinksWereWorking />}
            />
            <Route path="/store" element={<Store />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Analytics />
    </BrowserRouter>
  );
}
