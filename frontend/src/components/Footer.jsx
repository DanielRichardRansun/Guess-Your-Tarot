import { GiCrystalBall } from "react-icons/gi";
import { FiHeart } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import "./Footer.css";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer__container container">
        <div className="footer__brand">
          <GiCrystalBall className="footer__icon" />
          <span className="footer__title">Guess Your Tarot</span>
          <p className="footer__subtitle">by Ransite</p>
        </div>
        <p className="footer__copy">
          {t("footer.made_with")} <FiHeart className="footer__heart" /> —{" "}
          {t("footer.entertainment")}
        </p>
        <p className="footer__year">
          © {new Date().getFullYear()} Guess Your Tarot. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
