import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import DetailAnswerPage from "./pages/DetailAnswerPage";
import TarotLibraryPage from "./pages/TarotLibraryPage";
import AboutPage from "./pages/AboutPage";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="app">
          <Navbar />
          <main className="app__main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/reading/:slug" element={<DetailAnswerPage />} />
              <Route path="/library" element={<TarotLibraryPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
