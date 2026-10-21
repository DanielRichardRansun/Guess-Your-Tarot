import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import { GiCrystalBall } from "react-icons/gi";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import "./Navbar.css";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks = [
    { path: "/", label: t("navbar.home") },
    { path: "/library", label: t("navbar.library") },
    { path: "/about", label: t("navbar.about") },
  ];

  const isActive = (path) => location.pathname === path;

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav className="navbar glass">
        <div className="navbar__container container">
        <Link to="/" className="navbar__logo">
          <GiCrystalBall className="navbar__logo-icon" />
          <span className="navbar__logo-text">Guess Your Tarot</span>
        </Link>

        {/* Desktop nav links */}
        <div className="navbar__links navbar__links--desktop">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`navbar__link ${isActive(path) ? "navbar__link--active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="navbar__actions navbar__actions--desktop">
          <LanguageSwitcher />
          <button
            className="btn btn--icon btn--ghost navbar__theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>
        </div>

        {/* Hamburger toggle button - visible on mobile/tablet */}
        <button
          className="btn btn--icon btn--ghost navbar__mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <FiX style={{ stroke: "white", minWidth: 24, minHeight: 24, strokeWidth: 2.5 }} />
          ) : (
            <FiMenu style={{ stroke: "white", minWidth: 24, minHeight: 24, strokeWidth: 2.5 }} />
          )}
        </button>
      </div>
      </nav>

      {/* Mobile/Tablet slide-in menu */}
      {mobileOpen && (
        <div className="navbar__overlay" onClick={closeMobile} />
      )}
      <div className={`navbar__mobile-menu ${mobileOpen ? "navbar__mobile-menu--open" : ""}`}>
        {/* Close header inside sidebar */}
        <div className="navbar__mobile-header">
          <div className="navbar__mobile-header-brand">
            <GiCrystalBall className="navbar__mobile-header-icon" />
            <span>{t('appName')}</span>
          </div>
          <button className="navbar__mobile-close" onClick={closeMobile} aria-label="Close menu">
            <FiX />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="navbar__mobile-nav">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`navbar__mobile-link ${isActive(path) ? "navbar__mobile-link--active" : ""}`}
              onClick={closeMobile}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="navbar__mobile-divider" />

        {/* Theme toggle */}
        <button
          className="navbar__mobile-action"
          onClick={() => {
            toggleTheme();
          }}
        >
          {theme === "dark" ? <FiSun /> : <FiMoon />}
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {/* Language Switcher */}
        <div className="navbar__mobile-action navbar__mobile-action--lang">
          <LanguageSwitcher />
        </div>
      </div>
    </>
  );
}
