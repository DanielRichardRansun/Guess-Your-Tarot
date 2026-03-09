import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { FiSun, FiMoon, FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import { GiCrystalBall } from "react-icons/gi";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import "./Navbar.css";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { path: "/", label: t("navbar.home") },
    { path: "/library", label: t("navbar.library") },
    { path: "/about", label: t("navbar.about") },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar glass">
      <div className="navbar__container container">
        <Link to="/" className="navbar__logo">
          <GiCrystalBall className="navbar__logo-icon" />
          <span className="navbar__logo-text">Guess Your Tarot</span>
        </Link>

        <div
          className={`navbar__links ${mobileOpen ? "navbar__links--open" : ""}`}
        >
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`navbar__link ${isActive(path) ? "navbar__link--active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          {user && (
            <Link
              to="/profile"
              className={`navbar__link navbar__link--mobile-only ${isActive("/profile") ? "navbar__link--active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              {t("navbar.profile")}
            </Link>
          )}
        </div>

        <div className="navbar__actions">
          <LanguageSwitcher />

          <button
            className="btn btn--icon btn--ghost navbar__theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>

          {user ? (
            <div
              className="navbar__profile"
              onMouseLeave={() => setProfileOpen(false)}
            >
              <button
                className="navbar__avatar"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <span className="navbar__avatar-text">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </button>
              {profileOpen && (
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-header">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                  <Link
                    to="/profile"
                    className="navbar__dropdown-item"
                    onClick={() => setProfileOpen(false)}
                  >
                    <FiUser /> {t("navbar.profile")}
                  </Link>
                  <button
                    className="navbar__dropdown-item navbar__dropdown-item--danger"
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                  >
                    <FiLogOut /> {t("navbar.logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn--primary btn--sm">
              {t("navbar.login")}
            </Link>
          )}

          <button
            className="btn btn--icon btn--ghost navbar__mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
}
