import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FaSpotify,
  FaSteam,
  FaGithub,
  FaStrava,
  FaYoutube,
  FaDiscord,
} from "react-icons/fa";
import { FiSend, FiStar, FiZap } from "react-icons/fi";
import { GiCrystalBall, GiCardRandom } from "react-icons/gi";
import { useTranslation } from "react-i18next";
import CardShuffle from "../components/CardShuffle";
import api from "../api";
import "./HomePage.css";

const socialPlatforms = [
  {
    key: "spotify",
    name: "Spotify",
    icon: FaSpotify,
    color: "#1DB954",
    desc: "Discover your tarot through your music taste",
  },
  {
    key: "steam",
    name: "Steam",
    icon: FaSteam,
    color: "#1b2838",
    desc: "Let your gaming activity reveal your destiny",
  },
  {
    key: "github",
    name: "GitHub",
    icon: FaGithub,
    color: "#6e40c9",
    desc: "Your code commits hold hidden meanings",
  },
  {
    key: "strava",
    name: "Strava",
    icon: FaStrava,
    color: "#FC4C02",
    desc: "Your fitness journey mirrors your inner path",
  },
  {
    key: "youtube",
    name: "YouTube",
    icon: FaYoutube,
    color: "#FF0000",
    desc: "What you watch reflects your subconscious",
  },
  {
    key: "discord",
    name: "Discord",
    icon: FaDiscord,
    color: "#5865F2",
    desc: "Your conversations reveal your true self",
  },
];

export default function HomePage() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const handleReveal = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/readings", {
        input_text: inputText,
        source: "text",
        language: i18n.language?.toUpperCase().startsWith("ID") ? "ID" : "EN",
      });
      navigate(`/reading/${res.data.reading.share_slug}`);
    } catch (err) {
      if (err.response?.status === 429) {
        setLimitReached(true);
        setError(t("home.limit_reached"));
      } else {
        setError(
          err.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialReveal = async (platform) => {
    // Mock social data for demo
    const mockData = {
      spotify: {
        recent_tracks: [
          "Bohemian Rhapsody",
          "Stairway to Heaven",
          "Hotel California",
        ],
        mood: "nostalgic, reflective",
      },
      steam: {
        recent_games: ["Elden Ring", "Stardew Valley", "Dark Souls"],
        playtime_hours: 42,
      },
      github: {
        recent_repos: ["web-app", "ai-project", "portfolio"],
        languages: ["JavaScript", "Python"],
      },
      strava: {
        recent_activities: ["5K Run", "Morning Yoga", "Cycling"],
        total_km: 28,
      },
      youtube: {
        recent_watches: ["Meditation Guide", "Tech Review", "Cooking Tutorial"],
        categories: ["Education", "Entertainment"],
      },
      discord: {
        active_servers: 5,
        messages_today: 23,
        mood: "social, energetic",
      },
    };

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/readings", {
        input_text: `Based on my ${platform} activity, what tarot represents me today?`,
        source: platform,
        source_data: mockData[platform],
        language: i18n.language?.toUpperCase().startsWith("ID") ? "ID" : "EN",
      });
      navigate(`/reading/${res.data.reading.share_slug}`);
    } catch (err) {
      if (err.response?.status === 429) {
        setLimitReached(true);
        setError(t("home.limit_reached"));
      } else {
        setError(
          err.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReveal();
    }
  };

  return (
    <div className="home">
      {loading && <CardShuffle message={t("home.shuffling")} />}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero__bg-effects">
          <div className="hero__orb hero__orb--1"></div>
          <div className="hero__orb hero__orb--2"></div>
          <div className="hero__orb hero__orb--3"></div>
        </div>
        <div className="hero__container container">
          <div className="hero__badge">
            <GiCardRandom /> AI-Powered Tarot Reading
          </div>
          <h1 className="hero__title">
            {t("home.title")}{" "}
            <span className="text-gradient">{t("home.title_highlight")}</span>
          </h1>
          <p className="hero__subtitle">{t("home.subtitle")}</p>

          <div className="hero__input-wrapper">
            <textarea
              className="hero__input"
              placeholder={t("home.placeholder")}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={4}
              maxLength={2000}
            />
            <div className="hero__input-footer">
              <span className="hero__char-count">{inputText.length}/2000</span>
              <button
                className="btn btn--gold btn--lg hero__reveal-btn"
                onClick={handleReveal}
                disabled={!inputText.trim() || loading}
              >
                <FiStar /> {t("home.reveal_btn")}
              </button>
            </div>
          </div>

          {error && (
            <div
              className={`hero__error ${limitReached ? "hero__error--limit" : ""}`}
            >
              <p>{error}</p>
              {limitReached && !user && (
                <a
                  href="/login"
                  className="btn btn--primary btn--sm"
                  style={{ marginTop: "8px" }}
                >
                  {t("home.limit_login")}
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Social Media Section */}
      <section className="social section">
        <div className="container">
          <div className="social__header">
            <FiZap className="social__header-icon" />
            <h2 className="social__title">{t("home.social_title")}</h2>
            <p className="social__desc">{t("home.social_desc")}</p>
          </div>

          <div className="social__grid">
            {socialPlatforms.map((platform, i) => (
              <div
                key={platform.key}
                className="social__card card"
                style={{ animationDelay: `${(i + 1) * 0.1}s` }}
              >
                <div
                  className="social__card-icon"
                  style={{ color: platform.color }}
                >
                  <platform.icon />
                </div>
                <h3 className="social__card-name">{platform.name}</h3>
                <p className="social__card-desc">{platform.desc}</p>
                <button
                  className="btn btn--outline btn--sm social__card-btn"
                  onClick={() => handleSocialReveal(platform.key)}
                  disabled={loading}
                >
                  <GiCrystalBall /> {t("home.reveal_btn")}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
