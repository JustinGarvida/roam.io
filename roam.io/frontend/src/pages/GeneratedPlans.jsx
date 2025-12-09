import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PlansCard from "../components/plans/PlansCard";

function GeneratedPlans() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [tripData, setTripData] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(`trip-${id}`);
    if (stored) {
      try {
        setTripData(JSON.parse(stored));
      } catch (err) {
        console.error("Invalid trip data:", err);
      }
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="container py-5">Loading trip details...</div>;
  }

  if (!tripData) {
    return (
      <div className="container py-5">
        <h2 className="fw-bold text-dark">No trip found</h2>
        <p className="text-dark">Your trip info may have expired or been cleared.</p>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Go to Survey
        </button>
      </div>
    );
  }

  const { location, plans, survey } = tripData;

  const destinationLabel =
    location?.displayName ||
    location?.location ||
    location?.city ||
    "Your Destination";

  const handleSavePlan = (plan, index) => {
    console.log("Saved plan:", index, plan);
  };

  return (
    <div className="container py-5">
      <div className="mb-4 pb-3 border-bottom">
        <h1 className="fw-bold text-dark mb-2">
          Trip Plans for <span className="text-primary">{destinationLabel}</span>
        </h1>

        <p className="text-dark mb-2">
          Based on your survey responses, we selected{" "}
          <strong>{destinationLabel}</strong> as the best match for your trip.
        </p>

        {survey?.tripStartDate && survey?.tripEndDate && (
          <div className="d-flex gap-5 mt-3">
            <div>
              <strong className="text-dark">Start Date:</strong>
              <p className="m-0">{survey.tripStartDate}</p>
            </div>
            <div>
              <strong className="text-dark">End Date:</strong>
              <p className="m-0">{survey.tripEndDate}</p>
            </div>
          </div>
        )}

        {location?.zipCode && (
          <p className="small text-muted mt-2 mb-0">
            Suggested location was determined using ZIP <strong>{location.zipCode}</strong>.
          </p>
        )}

        <p className="text-dark mt-3">
          Below are the best trip options we generated for you. You may{" "}
          <strong>save any plan</strong> for later viewing.
        </p>

        <button className="btn btn-primary mt-2" onClick={() => navigate("/survey")}>
          Edit Survey
        </button>
      </div>

      {plans && plans.length > 0 ? (
        <div className="row gy-4">
          {plans.map((plan, idx) => (
            <div key={idx} className="col-12">
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
        <p className="text-dark">No plans were generated. Try adjusting your answers.</p>
      )}
    </div>
  );
}

export default GeneratedPlans;
