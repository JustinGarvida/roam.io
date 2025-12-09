import React from "react";

function HotelModal({ hotel, onClose }) {
  if (!hotel) return null;

  const {
    name,
    address,
    city,
    countryCode,
    checkInDate,
    checkOutDate,
    adults,
    roomQuantity,
    currency,
    totalPrice,
  } = hotel;

  const fullAddress =
    address || city || countryCode
      ? `${address || ""}${address && (city || countryCode) ? ", " : ""}${
          city || ""
        }${city && countryCode ? ", " : ""}${countryCode || ""}`
      : "Address unavailable";

  const formattedPrice =
    typeof totalPrice === "number" || typeof totalPrice === "string"
      ? `${currency || "USD"} ${Number(totalPrice).toFixed(2)}`
      : "Price unavailable";

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
      onClick={handleBackdropClick}
    >
      <div
        className="card shadow-lg border-0"
        style={{ maxWidth: "650px", width: "90%" }}
      >
        {/* Header */}
        <div className="card-header d-flex justify-content-between align-items-center bg-dark text-white">
          <div>
            <h5 className="mb-0">{name || "Hotel Details"}</h5>
            <small className="text-light-50">{fullAddress}</small>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>

        {/* Body */}
        <div className="card-body">
          {/* Stay + Price Row */}
          <div className="d-flex justify-content-between flex-wrap mb-3">
            <div className="me-3 mb-3">
              <h6 className="text-uppercase text-muted small mb-2">
                Stay Details
              </h6>
              <p className="mb-1">
                <span className="fw-semibold">Check-in:</span>{" "}
                {checkInDate || "—"}
              </p>
              <p className="mb-1">
                <span className="fw-semibold">Check-out:</span>{" "}
                {checkOutDate || "—"}
              </p>
              <p className="mb-0">
                <span className="fw-semibold">Guests:</span> {adults || 1}{" "}
                &nbsp;•&nbsp;
                <span className="fw-semibold">Rooms:</span>{" "}
                {roomQuantity || 1}
              </p>
            </div>

            <div className="text-end mb-3">
              <h6 className="text-uppercase text-muted small mb-1">
                Total Price
              </h6>
              <div className="fw-bold fs-4">{formattedPrice}</div>
            </div>
          </div>

          <hr />

          {/* Additional (minimal) info section */}
          <h6 className="text-uppercase text-muted small mb-2">
            Additional Info
          </h6>
          <p className="mb-1">
            <strong>Address:</strong> {fullAddress}
          </p>

          <div className="text-end mt-4">
            <button className="btn btn-outline-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelModal;
