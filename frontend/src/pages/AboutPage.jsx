import { GiCrystalBall } from "react-icons/gi";
import { FiShield, FiDatabase, FiSmile } from "react-icons/fi";
import "./AboutPage.css";

export default function AboutPage() {
  return (
    <div className="about">
      <div className="container container--narrow">
        <div className="about__header animate-fade-in-up">
          <GiCrystalBall className="about__header-icon" />
          <h1>About Guess Your Tarot</h1>
          <p className="about__header-subtitle">by Ransite</p>
        </div>

        <div className="about__cards">
          <div className="about__card card animate-fade-in-up delay-1">
            <div className="about__card-icon">
              <GiCrystalBall />
            </div>
            <h2>What This App Does</h2>
            <p>
              Guess Your Tarot uses artificial intelligence to reveal your daily
              tarot card based on your thoughts, feelings, and digital activity.
              Simply tell us how you're feeling or connect your social media
              accounts, and our AI will select the tarot card that resonates
              most with your current energy.
            </p>
            <p>
              Each reading includes a personalized explanation of your main
              tarot card, supportive cards that complement your energy, and
              challenging cards to be mindful of — helping you gain insight into
              your day ahead.
            </p>
          </div>

          <div className="about__card card animate-fade-in-up delay-2">
            <div className="about__card-icon about__card-icon--blue">
              <FiDatabase />
            </div>
            <h2>What Data Is Used</h2>
            <p>
              When you type your thoughts, we send that text to our AI to
              generate a relevant tarot reading. If you connect a social media
              account, we analyze your recent public activity (like music
              history, gaming stats, or watch history) to provide a more
              personalized reading.
            </p>
            <p>
              We value your privacy. Your data is only used during the reading
              session and is never shared with third parties. If you create an
              account, your reading history is saved securely so you can revisit
              past readings.
            </p>
          </div>

          <div className="about__card card animate-fade-in-up delay-3">
            <div className="about__card-icon about__card-icon--gold">
              <FiSmile />
            </div>
            <h2>Entertainment Disclaimer</h2>
            <p>
              Guess Your Tarot is designed for{" "}
              <strong>entertainment purposes only</strong>. Our AI-generated
              tarot readings are meant to provide fun insights and food for
              thought — they should not be taken as professional advice of any
              kind.
            </p>
            <p>
              Whether you're a tarot enthusiast or just curious, we hope our
              readings bring a little magic and wonder to your day. Remember,
              the real power lies within you! ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
