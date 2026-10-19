import { useEffect, useState } from "react";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DEMO_CREDENTIALS, isAuthenticated, login } from "../services/auth";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      login({ email, password });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-icon">
            <ShieldCheck size={22} />
          </div>
          <span>Enterprise AI Assistant</span>
        </div>

        <div className="login-header">
          <h1>Welcome back</h1>
          <p>Sign in to access your knowledge workspace.</p>
        </div>

        <div className="demo-credentials">
          <span>Demo login</span>
          <strong>{DEMO_CREDENTIALS.email}</strong>
          <em>{DEMO_CREDENTIALS.password}</em>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="secure-note">
          <LockKeyhole size={16} />
          <span>Secure access for your enterprise data</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
