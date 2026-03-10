import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { GiCrystalBall } from "react-icons/gi";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import "./AuthPage.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirmation) {
      setError(t("auth.password_mismatch"));
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, passwordConfirmation);
      navigate("/");
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        setError(Object.values(errors).flat().join(", "));
      } else {
        setError(err.response?.data?.message || t("auth.register_failed"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__card card">
        <div className="auth__header">
          <GiCrystalBall className="auth__icon" />
          <h1>{t("auth.register_title")}</h1>
          <p>{t("auth.register_subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth__form">
          {error && <div className="auth__error">{error}</div>}

          <div className="auth__field">
            <FiUser className="auth__field-icon" />
            <input
              type="text"
              placeholder={t("auth.name_placeholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder={t("auth.password_min")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <button
              type="button"
              className="auth__toggle-pass"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <div className="auth__field">
            <FiLock className="auth__field-icon" />
            <input
              type={showPass ? "text" : "password"}
              placeholder={t("auth.password_confirm_placeholder")}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--lg auth__submit"
            disabled={loading}
          >
            {loading ? t("auth.register_loading") : t("auth.register_btn")}
          </button>
        </form>

        <p className="auth__switch">
          {t("auth.have_account")} <Link to="/login">{t("auth.sign_in")}</Link>
        </p>
      </div>
    </div>
  );
}
