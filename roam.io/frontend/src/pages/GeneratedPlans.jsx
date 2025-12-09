import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PlansCard from "../components/plans/PlansCard";

function GeneratedPlans() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="container py-5">
        <h2>No trip data found</h2>
        <p>Start by filling out the trip survey.</p>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Go to Survey
        </button>
      </div>
    );
  }

  const { location, plans, survey } = state;

  const destinationLabel =
    location?.displayName || location?.location || location?.city || "Your trip";

  const handleSavePlan = (plan, index) => {
    // placeholder for future functionality
    console.log("Save clicked for plan", index + 1, plan);
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Generated Trip Plans</h2>
          <p className="text-muted mb-0">
            Destination suggestion: <strong>{destinationLabel}</strong>
            {location?.zipCode && <> (ZIP: {location.zipCode})</>}
          </p>
          {survey?.tripStartDate && survey?.tripEndDate && (
            <p className="text-muted mb-0">
              Dates: {survey.tripStartDate} → {survey.tripEndDate}
            </p>
          )}
        </div>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/")}
        >
          Edit Survey
        </button>
      </div>

      {/* Plans */}
      {plans && plans.length > 0 ? (
        <div className="row gy-3">
          {plans.map((plan, idx) => (
            <div key={idx} className="col-12 col-md-6">
              <PlansCard
                plan={plan}
                index={idx}
                destinationLabel={destinationLabel}
                survey={survey}
                onSave={handleSavePlan}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No plans were generated. Try adjusting your survey answers.</p>
      )}
    </div>
  );
}

export default GeneratedPlans;
