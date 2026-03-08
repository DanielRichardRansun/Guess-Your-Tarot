import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FiHeart,
  FiCopy,
  FiCheck,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { FaTwitter, FaFacebook, FaWhatsapp, FaTelegram } from "react-icons/fa";
import api from "../api";
import "./DetailAnswerPage.css";

export default function DetailAnswerPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [reading, setReading] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showFullInput, setShowFullInput] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cardFlipped, setCardFlipped] = useState(false);

  useEffect(() => {
    fetchReading();
  }, [slug]);

  useEffect(() => {
    if (reading) {
      setTimeout(() => setCardFlipped(true), 500);
    }
  }, [reading]);

  const fetchReading = async () => {
    try {
      const res = await api.get(`/readings/${slug}`);
      setReading(res.data.reading);
      setIsFavorited(res.data.is_favorited);
    } catch (err) {
      setError("Reading not found");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!user) return;
    try {
      const res = await api.post(`/readings/${reading.id}/favorite`);
      setIsFavorited(res.data.is_favorited);
    } catch {}
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = reading
    ? `✨ My tarot today is ${reading.main_tarot_name}! Find out yours at Guess Your Tarot`
    : "";

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateInput = (text, maxLen = 120) => {
    if (!text || text.length <= maxLen) return text;
    return text.substring(0, maxLen);
  };

  const renderLongExplanation = (text) => {
    if (!text) return null;
    const paragraphs = text.split("\n").filter((p) => p.trim());
    return paragraphs.map((p, i) => {
      if (
        p.trim().startsWith("•") ||
        p.trim().startsWith("-") ||
        p.trim().startsWith("*")
      ) {
        return (
          <li key={i} className="detail__point">
            {p.replace(/^[•\-\*]\s*/, "")}
          </li>
        );
      }
      return (
        <p key={i} className="detail__paragraph">
          {p}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="detail detail--loading">
        <div className="container container--narrow">
          <div
            className="skeleton"
            style={{ height: "40px", width: "60%", margin: "0 auto 20px" }}
          ></div>
          <div
            className="skeleton"
            style={{
              height: "300px",
              width: "200px",
              margin: "0 auto 20px",
              borderRadius: "12px",
            }}
          ></div>
          <div
            className="skeleton"
            style={{ height: "100px", margin: "0 auto 20px" }}
          ></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail detail--error">
        <div
          className="container container--narrow"
          style={{ textAlign: "center", paddingTop: "120px" }}
        >
          <h2>Reading Not Found</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "12px" }}>
            This tarot reading doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="btn btn--primary"
            style={{ marginTop: "24px" }}
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const mainTarotImage = reading.main_tarot
    ? `/images/tarot/${reading.main_tarot.image}`
    : "";

  return (
    <div className="detail">
      <div className="container container--narrow">
        {/* Share Bar Top */}
        <div className="detail__share-bar animate-fade-in-up">
          <div className="detail__share-socials">
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--icon btn--ghost"
              title="Share on Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--icon btn--ghost"
              title="Share on Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--icon btn--ghost"
              title="Share on WhatsApp"
            >
              <FaWhatsapp />
            </a>
            <a
              href={shareLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--icon btn--ghost"
              title="Share on Telegram"
            >
              <FaTelegram />
            </a>
          </div>
          <div className="detail__share-actions">
            {user && (
              <button
                className={`btn btn--icon btn--ghost detail__fav-btn ${isFavorited ? "detail__fav-btn--active" : ""}`}
                onClick={toggleFavorite}
                title={
                  isFavorited ? "Remove from favorites" : "Add to favorites"
                }
              >
                <FiHeart />
              </button>
            )}
            <button
              className="btn btn--icon btn--ghost"
              onClick={copyLink}
              title="Copy link"
            >
              {copied ? <FiCheck style={{ color: "#22c55e" }} /> : <FiCopy />}
            </button>
          </div>
        </div>

        {/* Date & Input */}
        <div className="detail__meta animate-fade-in-up delay-1">
          <span className="detail__date">
            <FiCalendar /> {formatDate(reading.created_at)}
          </span>
          {reading.input_text && (
            <div className="detail__input-preview">
              <p>
                "
                {showFullInput
                  ? reading.input_text
                  : truncateInput(reading.input_text)}
                "
                {reading.input_text.length > 120 && (
                  <button
                    className="detail__readmore"
                    onClick={() => setShowFullInput(!showFullInput)}
                  >
                    {showFullInput ? (
                      <>
                        <FiChevronUp /> show less
                      </>
                    ) : (
                      <>
                        <FiChevronDown /> read more
                      </>
                    )}
                  </button>
                )}
              </p>
            </div>
          )}
          {reading.source !== "text" && (
            <div className="detail__source-badge">
              Via{" "}
              {reading.source.charAt(0).toUpperCase() + reading.source.slice(1)}
            </div>
          )}
        </div>

        {/* Main Tarot Card */}
        <div className="detail__hero animate-fade-in-up delay-2">
          <h1 className="detail__tarot-title">{reading.main_tarot_name}</h1>
          <div
            className={`detail__card-wrapper ${cardFlipped ? "detail__card-wrapper--flipped" : ""}`}
          >
            <div className="detail__card">
              <div className="detail__card-front">
                <img
                  src={mainTarotImage}
                  alt={reading.main_tarot_name}
                  className="detail__card-image"
                />
              </div>
              <div className="detail__card-back">
                <div className="detail__card-back-pattern">✦</div>
              </div>
            </div>
          </div>
        </div>

        {/* Short Explanation */}
        <div className="detail__highlight animate-fade-in-up delay-3">
          <div className="detail__highlight-inner">
            <p>{reading.short_explanation}</p>
          </div>
        </div>

        {/* Long Explanation */}
        <div className="detail__explanation animate-fade-in-up delay-4">
          <div className="detail__explanation-content">
            {renderLongExplanation(reading.long_explanation)}
          </div>
        </div>

        {/* Supporting Tarots */}
        {reading.support_tarots && reading.support_tarots.length > 0 && (
          <div className="detail__related animate-fade-in-up delay-5">
            <h2 className="detail__related-title">
              <span className="detail__related-icon">🌟</span> Tarots That
              Support You
            </h2>
            <div className="detail__related-grid">
              {reading.support_tarots.map((tarot, i) => (
                <div key={i} className="detail__related-card card">
                  <img
                    src={`/images/tarot/${tarot.image}`}
                    alt={tarot.name}
                    className="detail__related-img"
                  />
                  <h3>{tarot.name}</h3>
                  <p>{tarot.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Challenge Tarots */}
        {reading.challenge_tarots && reading.challenge_tarots.length > 0 && (
          <div className="detail__related animate-fade-in-up">
            <h2 className="detail__related-title">
              <span className="detail__related-icon">⚡</span> Tarots That
              Challenge You
            </h2>
            <div className="detail__related-grid">
              {reading.challenge_tarots.map((tarot, i) => (
                <div key={i} className="detail__related-card card">
                  <img
                    src={`/images/tarot/${tarot.image}`}
                    alt={tarot.name}
                    className="detail__related-img"
                  />
                  <h3>{tarot.name}</h3>
                  <p>{tarot.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Share Bar Bottom */}
        <div className="detail__share-bar detail__share-bar--bottom animate-fade-in-up">
          <p className="detail__share-label">Share your reading ✨</p>
          <div className="detail__share-socials">
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--outline btn--sm"
            >
              <FaTwitter /> Twitter
            </a>
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--outline btn--sm"
            >
              <FaFacebook /> Facebook
            </a>
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--outline btn--sm"
            >
              <FaWhatsapp /> WhatsApp
            </a>
          </div>
          <div className="detail__share-actions">
            {user && (
              <button
                className={`btn btn--outline btn--sm ${isFavorited ? "detail__fav-btn--active" : ""}`}
                onClick={toggleFavorite}
              >
                <FiHeart /> {isFavorited ? "Favorited" : "Favorite"}
              </button>
            )}
            <button className="btn btn--outline btn--sm" onClick={copyLink}>
              {copied ? (
                <>
                  <FiCheck /> Copied!
                </>
              ) : (
                <>
                  <FiCopy /> Copy Link
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
