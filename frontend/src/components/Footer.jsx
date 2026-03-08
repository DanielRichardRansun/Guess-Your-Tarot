import { GiCrystalBall } from "react-icons/gi";
import { FiHeart } from "react-icons/fi";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container container">
        <div className="footer__brand">
          <GiCrystalBall className="footer__icon" />
          <span className="footer__title">Guess Your Tarot</span>
          <p className="footer__subtitle">by Ransite</p>
        </div>
        <p className="footer__copy">
          Made with <FiHeart className="footer__heart" /> — For entertainment
          purposes only
        </p>
        <p className="footer__year">
          © {new Date().getFullYear()} Guess Your Tarot. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
