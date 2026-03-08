import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  FiEdit2,
  FiClock,
  FiHeart,
  FiLink,
  FiLogOut,
  FiSun,
  FiMoon,
  FiSave,
  FiX,
} from "react-icons/fi";
import {
  FaSpotify,
  FaSteam,
  FaGithub,
  FaStrava,
  FaYoutube,
  FaDiscord,
} from "react-icons/fa";
import { GiCrystalBall } from "react-icons/gi";
import api from "../api";
import "./ProfilePage.css";

const socialIcons = {
  spotify: FaSpotify,
  steam: FaSteam,
  github: FaGithub,
  strava: FaStrava,
  youtube: FaYoutube,
  discord: FaDiscord,
};

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [tab, setTab] = useState("history");
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setEditName(user.name || "");
    fetchHistory();
    fetchFavorites();
  }, [user]);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/readings-history");
      setHistory(res.data.data || []);
    } catch {}
  };

  const fetchFavorites = async () => {
    try {
      const res = await api.get("/readings-favorites");
      setFavorites(res.data.data || []);
    } catch {}
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const res = await api.put("/profile", { name: editName });
      setUser(res.data);
      setEditing(false);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) return null;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const tabs = [
    { key: "history", label: "History", icon: <FiClock /> },
    { key: "favorites", label: "Favorites", icon: <FiHeart /> },
    { key: "social", label: "Social", icon: <FiLink /> },
  ];

  const allPlatforms = [
    "spotify",
    "steam",
    "github",
    "strava",
    "youtube",
    "discord",
  ];

  return (
    <div className="profile">
      <div className="container container--narrow">
        {/* Profile Header */}
        <div className="profile__header card">
          <div className="profile__avatar">
            <span>{user.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="profile__info">
            {editing ? (
              <div className="profile__edit-form">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="profile__edit-input"
                />
                <button
                  className="btn btn--primary btn--sm"
                  onClick={handleSaveProfile}
                  disabled={loading}
                >
                  <FiSave /> Save
                </button>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => {
                    setEditing(false);
                    setEditName(user.name);
                  }}
                >
                  <FiX />
                </button>
              </div>
            ) : (
              <>
                <h1 className="profile__name">{user.name}</h1>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => setEditing(true)}
                >
                  <FiEdit2 /> Edit
                </button>
              </>
            )}
            <p className="profile__email">{user.email}</p>
            {user.current_tarot && (
              <p className="profile__current-tarot">
                <GiCrystalBall /> Current Tarot:{" "}
                <strong>{user.current_tarot?.name}</strong>
              </p>
            )}
          </div>
          <div className="profile__actions-right">
            <button className="btn btn--ghost btn--sm" onClick={toggleTheme}>
              {theme === "dark" ? <FiSun /> : <FiMoon />}
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <button
              className="btn btn--ghost btn--sm profile__logout-btn"
              onClick={handleLogout}
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile__tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`profile__tab ${tab === t.key ? "profile__tab--active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="profile__content">
          {tab === "history" && (
            <div className="profile__list">
              {history.length === 0 ? (
                <div className="profile__empty">
                  <GiCrystalBall />
                  <p>No readings yet. Go reveal your tarot!</p>
                  <Link to="/" className="btn btn--primary btn--sm">
                    Get a Reading
                  </Link>
                </div>
              ) : (
                history.map((reading) => (
                  <Link
                    key={reading.id}
                    to={`/reading/${reading.share_slug}`}
                    className="profile__reading card"
                  >
                    {reading.main_tarot && (
                      <img
                        src={`/images/tarot/${reading.main_tarot.image}`}
                        alt={reading.main_tarot_name}
                        className="profile__reading-img"
                      />
                    )}
                    <div className="profile__reading-info">
                      <h3>{reading.main_tarot_name}</h3>
                      <p>{reading.short_explanation?.substring(0, 100)}...</p>
                      <span className="profile__reading-date">
                        {formatDate(reading.created_at)}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {tab === "favorites" && (
            <div className="profile__list">
              {favorites.length === 0 ? (
                <div className="profile__empty">
                  <FiHeart />
                  <p>No favorites yet. Heart a reading to save it here!</p>
                </div>
              ) : (
                favorites.map((reading) => (
                  <Link
                    key={reading.id}
                    to={`/reading/${reading.share_slug}`}
                    className="profile__reading card"
                  >
                    {reading.main_tarot && (
                      <img
                        src={`/images/tarot/${reading.main_tarot.image}`}
                        alt={reading.main_tarot_name}
                        className="profile__reading-img"
                      />
                    )}
                    <div className="profile__reading-info">
                      <h3>{reading.main_tarot_name}</h3>
                      <p>{reading.short_explanation?.substring(0, 100)}...</p>
                      <span className="profile__reading-date">
                        {formatDate(reading.created_at)}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {tab === "social" && (
            <div className="profile__social-grid">
              {allPlatforms.map((platform) => {
                const Icon = socialIcons[platform];
                return (
                  <div key={platform} className="profile__social-card card">
                    <Icon className="profile__social-icon" />
                    <span className="profile__social-name">
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </span>
                    <button className="btn btn--outline btn--sm">
                      Connect
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
