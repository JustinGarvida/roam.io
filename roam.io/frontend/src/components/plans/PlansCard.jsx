import React from "react";

function PlansCard({ plan, index, destinationLabel, survey, onSave }) {
  if (!plan) return null;

  const currency = plan.currency || "USD";
  const checkIn = plan.checkInDate || survey?.tripStartDate;
  const checkOut = plan.checkOutDate || survey?.tripEndDate;

  const handleSaveClick = () => {
    if (onSave) onSave(plan, index);
  };

  return (
    <div className="card shadow-sm border-0 rounded-3">
      <div className="card-body">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h4 className="fw-bold mb-1 text-dark">Option {index + 1}</h4>
            <h6 className="fw-semibold text-dark mb-1">
              {plan.destination || destinationLabel}
            </h6>
          </div>

          {plan.totalTripPrice != null && (
            <div className="text-end">
              <div className="fw-bold fs-5 text-dark">
                {currency} {plan.totalTripPrice}
              </div>
              <div className="small text-dark">Total Cost</div>
            </div>
          )}
        </div>

        {/* DATE CELLS */}
        <div className="d-flex gap-3 mb-3">
          <div className="flex-fill border rounded p-3 text-center bg-light">
            <div className="fw-semibold text-dark">Check-in</div>
            <div className="fs-6 text-dark">{checkIn}</div>
          </div>

          <div className="flex-fill border rounded p-3 text-center bg-light">
            <div className="fw-semibold text-dark">Check-out</div>
            <div className="fs-6 text-dark">{checkOut}</div>
          </div>
        </div>

        {/* HOTEL CELL */}
        {plan.hotel && (
          <div className="border rounded p-3 mb-3 bg-white">
            <div className="fw-bold text-dark mb-1">Hotel</div>

            <div className="d-flex justify-content-between">
              <div className="text-dark">{plan.hotel.name || "N/A"}</div>

              {plan.hotel.totalPrice && (
                <div className="fw-semibold text-dark">
                  {currency} {plan.hotel.totalPrice}
                </div>
              )}
            </div>

            {plan.hotel.address && (
              <div className="small text-dark mt-1">{plan.hotel.address}</div>
            )}
          </div>
        )}

        {/* FLIGHT CELL */}
        {plan.flight && (
          <div className="border rounded p-3 mb-3 bg-white">
            <div className="fw-bold text-dark mb-1">Flight</div>

            <div className="d-flex justify-content-between">
              <div>
                <div className="fw-semibold text-dark">
                  {plan.flight.origin} → {plan.flight.destination}
                </div>
              </div>

              {plan.flight.price && (
                <div className="fw-semibold text-dark">
                  {currency} {plan.flight.price}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SAVE BUTTON */}
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-primary btn-sm px-4"
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
