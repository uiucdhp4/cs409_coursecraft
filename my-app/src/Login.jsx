import { useState } from "react";
import { login } from "./auth";

/**
 * Temporary prototype login screen.
 * Validates against src/credentials.txt (frontend-only).
 */
function Login({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const success = login(username.trim(), password);
    if (success) {
      onSuccess();
      return;
    }

    setError("Incorrect username or password.");
  }

  return (
    <main className="login-page">
      <div className="login-panel">
        <div className="login-brand">
          <span className="brand-icon">C</span>
          <span>CourseCraft</span>
        </div>

        <p className="login-eyebrow">UNIVERSITY OF ILLINOIS</p>
        <h1>Sign in</h1>
        <p className="login-subtitle">
          Access the Course Explorer prototype.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <aside className="demo-account">
          <h2>Demo Account</h2>
          <p>Username: user123</p>
          <p>Password: password</p>
        </aside>
      </div>
    </main>
  );
}

export default Login;
