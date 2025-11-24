import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function TripPlans() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const location = state?.location;
  const plans = state?.plans || [];
  const survey = state?.survey;

  if (!location || plans.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="card shadow-lg p-4" style={{ width: "700px" }}>
          <h3 className="mb-3">No trip plans available</h3>
          <p className="text-muted mb-3">
            It looks like you navigated here directly. Please fill out the
            survey so we can generate a trip plan for you.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/survey")}
          >
            Go to Survey
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div
        className="card shadow-lg p-5"
        style={{ width: "800px", borderRadius: "12px" }}
      >
        <h2 className="fw-bold mb-2">
          Your Trip to {location.name || location.city || "Your Destination"}
        </h2>
        {location.country && (
          <p className="text-muted mb-4">{location.country}</p>
        )}

        {plans.map((plan, idx) => (
          <div key={idx} className="mb-4 p-3 rounded border bg-light">
            <h5 className="fw-semibold mb-2">
              Plan {idx + 1}
            </h5>
            <p className="mb-0" style={{ whiteSpace: "pre-line" }}>
              {typeof plan === "string" ? plan : plan.description}
            </p>
          </div>
        ))}

        <div className="d-flex justify-content-between mt-4">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/survey")}
          >
            Edit Survey
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default TripPlans;
