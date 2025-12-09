import React from "react";

function PlansCard({ plan, index, destinationLabel, survey, onSave }) {
  if (!plan) return null;

  const currency = plan.currency || "USD";
  const checkIn = plan.checkInDate || survey?.tripStartDate;
  const checkOut = plan.checkOutDate || survey?.tripEndDate;

  const handleSaveClick = () => {
    if (onSave) {
      onSave(plan, index);
    }
  };

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-body d-flex flex-column">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h5 className="card-title mb-1">
              Option {index + 1}: {plan.destination || destinationLabel}
            </h5>
            {checkIn && checkOut && (
              <p className="text-muted mb-0 small">
                {checkIn} → {checkOut}
              </p>
            )}
          </div>

          {plan.totalTripPrice != null && (
            <div className="text-end">
              <div className="fw-bold">
                {currency} {plan.totalTripPrice}
              </div>
              <div className="small text-muted">Estimated total</div>
            </div>
          )}
        </div>

        <hr />

        {/* Hotel section */}
        {plan.hotel && (
          <div className="mb-2">
            <h6 className="text-uppercase small text-muted mb-1">Hotel</h6>
            <p className="mb-1">
              <strong>Name:</strong> {plan.hotel.name || "N/A"}
            </p>
            {plan.hotel.totalPrice && (
              <p className="mb-0">
                <strong>Price:</strong> {currency} {plan.hotel.totalPrice}
              </p>
            )}
          </div>
        )}

        {/* Flight section */}
        {plan.flight && (
          <div className="mb-2">
            <h6 className="text-uppercase small text-muted mb-1">Flight</h6>
            {plan.flight.price && (
              <p className="mb-1">
                <strong>Price:</strong> {currency} {plan.flight.price}
              </p>
            )}
            {plan.flight.departureDate && (
              <p className="mb-0">
                <strong>Departure date:</strong> {plan.flight.departureDate}
              </p>
            )}
          </div>
        )}

        {/* Spacer + Save button */}
        <div className="mt-auto d-flex justify-content-end pt-2">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={handleSaveClick}
          >
            Save Plan
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlansCard;
