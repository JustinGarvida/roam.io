import React, { useState } from "react";
import { supabase } from "../services/auth";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      let { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage(
          "A password reset link has been sent to your email address."
        );
      }
    } catch (err) {
      console.error(err);
      setMessage("Error sending reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Forgot Password</h2>
          <p className="text-muted">Enter your email to reset your password</p>
        </div>

        <form onSubmit={handleForgotPassword}>
          <div className="mb-3">
            <label className="form-label fw-bold">Email address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <div className="alert alert-info text-center mt-3">{message}</div>
        )}

        <div className="text-center mt-3">
          <small className="text-muted">
            Remember your password?{" "}
            <a href="/login" className="text-decoration-none">
              Log In
            </a>
          </small>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
