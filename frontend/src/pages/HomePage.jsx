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

  const handleReveal = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/readings", {
        input_text: inputText,
        source: "text",
      });
      navigate(`/reading/${res.data.reading.share_slug}`);
    } catch (err) {
      if (err.response?.status === 429) {
        setLimitReached(true);
        setError(err.response.data.message);
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
      });
      navigate(`/reading/${res.data.reading.share_slug}`);
    } catch (err) {
      if (err.response?.status === 429) {
        setLimitReached(true);
        setError(err.response.data.message);
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
      {loading && <CardShuffle message="Shuffling the cosmic deck..." />}

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
            What Tarot Are You <span className="text-gradient">Today?</span>
          </h1>
          <p className="hero__subtitle">
            Tell us how you feel today and let AI reveal your tarot card. Your
            thoughts hold the key to your cosmic destiny.
          </p>

          <div className="hero__input-wrapper">
            <textarea
              className="hero__input"
              placeholder="Tell me what's on your mind today... How are you feeling? What happened recently? What are you hoping for?"
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
                <FiStar /> Reveal My Tarot
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
                  Sign in for unlimited readings
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
            <h2 className="social__title">Guess My Tarot from Social Media</h2>
            <p className="social__desc">
              Connect your account and discover your tarot through your digital
              activity
            </p>
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
                  <GiCrystalBall /> Reveal My Tarot
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
