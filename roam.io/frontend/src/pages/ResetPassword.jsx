import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/auth";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Password updated! Redirecting...");

        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Reset Password</h2>
          <p className="text-muted">Enter a new password</p>
        </div>

        <form onSubmit={handleReset}>
          <div className="mb-3">
            <label className="form-label fw-bold">New Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <div className="alert alert-info text-center mt-3">{message}</div>
        )}

        <div className="text-center mt-3">
          <small className="text-muted">
            Back to{" "}
            <a href="/login" className="text-decoration-none">
              Login
            </a>
          </small>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
