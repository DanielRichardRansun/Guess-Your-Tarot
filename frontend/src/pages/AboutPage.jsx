import { GiCrystalBall } from "react-icons/gi";
import { FiShield, FiDatabase, FiSmile } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import "./AboutPage.css";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="about">
      <div className="container container--narrow">
        <div className="about__header">
          <GiCrystalBall className="about__header-icon" />
          <h1>{t("about.title")}</h1>
          <p className="about__header-subtitle">{t("about.by")}</p>
        </div>

        <div className="about__cards">
          <div className="about__card card">
            <div className="about__card-icon">
              <GiCrystalBall />
            </div>
            <h2>{t("about.section1_title")}</h2>
            <p>{t("about.section1_p1")}</p>
            <p>{t("about.section1_p2")}</p>
          </div>

          <div className="about__card card">
            <div className="about__card-icon about__card-icon--blue">
              <FiDatabase />
            </div>
            <h2>{t("about.section2_title")}</h2>
            <p>{t("about.section2_p1")}</p>
            <p>{t("about.section2_p2")}</p>
          </div>

          <div className="about__card card">
            <div className="about__card-icon about__card-icon--gold">
              <FiSmile />
            </div>
            <h2>{t("about.section3_title")}</h2>
            <p>{t("about.section3_p1")}</p>
            <p>{t("about.section3_p2")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
