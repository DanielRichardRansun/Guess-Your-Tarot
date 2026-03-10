import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { GiCrystalBall } from "react-icons/gi";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import "./AuthPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || t("auth.invalid_credentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__card card">
        <div className="auth__header">
          <GiCrystalBall className="auth__icon" />
          <h1>{t("auth.login_title")}</h1>
          <p>{t("auth.login_subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth__form">
          {error && <div className="auth__error">{error}</div>}

          <div className="auth__field">
            <FiMail className="auth__field-icon" />
            <input
              type="email"
              placeholder={t("auth.email_placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth__field">
            <FiLock className="auth__field-icon" />
            <input
              type={showPass ? "text" : "password"}
              placeholder={t("auth.password_placeholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="auth__toggle-pass"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--lg auth__submit"
            disabled={loading}
          >
            {loading ? t("auth.login_loading") : t("auth.login_btn")}
          </button>
        </form>

        <p className="auth__switch">
          {t("auth.no_account")}{" "}
          <Link to="/register">{t("auth.create_one")}</Link>
        </p>
      </div>
    </div>
  );
}
