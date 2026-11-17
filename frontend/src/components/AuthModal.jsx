import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
  X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function AuthModal({
  isOpen,
  onClose,
  initialMode = "login"
}) {
  const { login, register } = useAuth();

  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError("");
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    function closeWithEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener(
        "keydown",
        closeWithEscape
      );

      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener(
        "keydown",
        closeWithEscape
      );

      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

function updateField(event) {
  const { name, value } = event.target;

  setFormData((currentData) => ({
    ...currentData,
    [name]: value
  }));

  setError("");
}

  function changeMode(nextMode) {
    setMode(nextMode);
    setError("");
    setShowPassword(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (
      mode === "register" &&
      formData.name.trim().length < 2
    ) {
      setError(
        "Enter a name containing at least 2 characters."
      );

      return;
    }

    if (!formData.email.trim()) {
      setError("Enter your email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }

    try {
      setSubmitting(true);

      if (mode === "register") {
        await register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password
        });
      } else {
        await login({
          email: formData.email.trim(),
          password: formData.password
        });
      }

      setFormData({
        name: "",
        email: "",
        password: ""
      });

      onClose();
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        "Unable to connect to the authentication service.";

      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-heading"
      >
        <button
          className="modal-close-button"
          type="button"
          onClick={onClose}
          aria-label="Close authentication dialog"
        >
          <X size={21} />
        </button>

        <div className="auth-modal-brand">
          NEXA<span>STORE</span>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={
              mode === "login"
                ? "auth-tab active"
                : "auth-tab"
            }
            onClick={() => changeMode("login")}
          >
            Sign in
          </button>

          <button
            type="button"
            className={
              mode === "register"
                ? "auth-tab active"
                : "auth-tab"
            }
            onClick={() => changeMode("register")}
          >
            Register
          </button>
        </div>

        <div className="auth-heading">
          <span className="auth-icon">
            <LockKeyhole size={22} />
          </span>

          <div>
            <h2 id="auth-heading">
              {mode === "login"
                ? "Welcome back"
                : "Create your account"}
            </h2>

            <p>
              {mode === "login"
                ? "Sign in to access checkout and your orders."
                : "Register to start shopping with NexaStore."}
            </p>
          </div>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          {mode === "register" && (
            <label className="form-field">
              <span>Full name</span>

              <div className="input-wrapper">
                <UserRound size={18} />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={updateField}
                  placeholder="Lazaro Otieno"
                  autoComplete="name"
                  disabled={submitting}
                />
              </div>
            </label>
          )}

          <label className="form-field">
            <span>Email address</span>

            <div className="input-wrapper">
              <Mail size={18} />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={updateField}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={submitting}
              />
            </div>
          </label>

          <label className="form-field">
            <span>Password</span>

            <div className="input-wrapper">
              <LockKeyhole size={18} />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={updateField}
                placeholder="Minimum 6 characters"
                autoComplete={
                  mode === "login"
                    ? "current-password"
                    : "new-password"
                }
                disabled={submitting}
              />

              <button
                className="password-toggle"
                type="button"
                onClick={() =>
                  setShowPassword(
                    (currentValue) => !currentValue
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </label>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <button
            className="auth-submit-button"
            type="submit"
            disabled={submitting}
          >
            {submitting && (
              <LoaderCircle
                className="spinning-icon"
                size={19}
              />
            )}

            {submitting
              ? "Please wait..."
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        <p className="auth-switch-message">
          {mode === "login"
            ? "New to NexaStore?"
            : "Already have an account?"}

          <button
            type="button"
            onClick={() =>
              changeMode(
                mode === "login"
                  ? "register"
                  : "login"
              )
            }
          >
            {mode === "login"
              ? "Create an account"
              : "Sign in"}
          </button>
        </p>

        <div className="auth-soa-note">
          Authentication is handled by a separate Auth
          Service through the API Gateway.
        </div>
      </section>
    </div>
  );
}

export default AuthModal;