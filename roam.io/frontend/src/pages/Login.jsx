import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

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
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Login successful!");
        if (data.session) {
          localStorage.setItem("supabaseSession", JSON.stringify(data.session));
        }
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
