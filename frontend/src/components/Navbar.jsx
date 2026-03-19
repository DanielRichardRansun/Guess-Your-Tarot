import { useState, useEffect, useRef } from "react";
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
  const profileRef = useRef(null);
  const navRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
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
    <nav className="navbar glass" ref={navRef}>
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

          {user ? (
            <div className="navbar__profile" ref={profileRef}>
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
        </div>

        {/* Hamburger toggle button - visible on mobile/tablet */}
        <button
          className="navbar__mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

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

        {/* User info header (if logged in) */}
        {user && (
          <div className="navbar__mobile-user">
            <div className="navbar__mobile-avatar">
              <span>{user.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="navbar__mobile-user-info">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
          </div>
        )}

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
          {user && (
            <Link
              to="/profile"
              className={`navbar__mobile-link ${isActive("/profile") ? "navbar__mobile-link--active" : ""}`}
              onClick={closeMobile}
            >
              <FiUser style={{ marginRight: 8 }} />
              {t("navbar.profile")}
            </Link>
          )}
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

        {/* Divider */}
        <div className="navbar__mobile-divider" />

        {/* Auth buttons */}
        <div className="navbar__mobile-auth">
          {user ? (
            <button
              className="btn btn--outline navbar__mobile-logout"
              onClick={() => {
                logout();
                closeMobile();
              }}
            >
              <FiLogOut /> {t("navbar.logout")}
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn--primary"
                onClick={closeMobile}
              >
                {t("navbar.login")}
              </Link>
              <Link
                to="/register"
                className="btn btn--outline"
                onClick={closeMobile}
              >
                {t("navbar.signup")}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
