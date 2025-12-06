// src/pages/GeneratedPlans.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

  return (
    <div className="container py-5">
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

      {plans && plans.length > 0 ? (
        <div className="row gy-3">
          {plans.map((plan, idx) => (
            <div key={idx} className="col-12 col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    Option {idx + 1}:{" "}
                    {plan.destination || destinationLabel}
                  </h5>

                  <p className="card-text mb-1">
                    <strong>Check-in:</strong>{" "}
                    {plan.checkInDate || survey?.tripStartDate}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Check-out:</strong>{" "}
                    {plan.checkOutDate || survey?.tripEndDate}
                  </p>

                  {plan.totalTripPrice != null && (
                    <p className="card-text mb-1">
                      <strong>Estimated total:</strong>{" "}
                      {plan.currency || "USD"} {plan.totalTripPrice}
                    </p>
                  )}

                  {plan.hotel && (
                    <>
                      <p className="card-text mb-1">
                        <strong>Hotel:</strong> {plan.hotel.name}
                      </p>
                      {plan.hotel.totalPrice && (
                        <p className="card-text mb-1">
                          <strong>Hotel price:</strong>{" "}
                          {plan.currency || "USD"} {plan.hotel.totalPrice}
                        </p>
                      )}
                    </>
                  )}

                  {plan.flight && (
                    <>
                      <p className="card-text mb-1">
                        <strong>Flight price:</strong>{" "}
                        {plan.currency || "USD"} {plan.flight.price}
                      </p>
                      {plan.flight.departureDate && (
                        <p className="card-text mb-0">
                          <strong>Flight date:</strong>{" "}
                          {plan.flight.departureDate}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
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
