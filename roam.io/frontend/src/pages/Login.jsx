import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState("");
  let [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  let handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);
      let res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setMessage("Login failed");
      } else {
        setMessage("Login successful!");
        setTimeout(() => navigate("/home"), 1000);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Welcome Back</h2>
          <p className="text-muted">Log in to your account</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-bold">Email address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(email) => setEmail(email.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(password) => setPassword(password.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {message && (
          <div className="alert alert-info text-center mt-3" role="alert">
            {message}
          </div>
        )}

        <div className="text-center mt-3">
          <small className="text-muted">
            Don’t have an account?{" "}
            <a href="/signup" className="text-decoration-none">
              Sign up
            </a>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;
