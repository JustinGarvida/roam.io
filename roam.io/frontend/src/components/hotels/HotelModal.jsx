import React from "react";

function HotelModal({ hotel, onClose }) {
  if (!hotel) return null;

  const {
    name,
    chainCode,
    iataCode,
    latitude,
    longitude,
    address,
    city,
    countryCode,
  } = hotel;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
      onClick={handleBackdropClick}
    >
      <div className="card shadow-lg" style={{ maxWidth: "600px", width: "90%" }}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{name || "Hotel Details"}</h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
        <div className="card-body">
          <p className="mb-1">
            <strong>Address:</strong>{" "}
            {address || city || countryCode
              ? `${address || ""}${address && (city || countryCode) ? ", " : ""}${
                  city || ""
                }${city && countryCode ? ", " : ""}${countryCode || ""}`
              : "N/A"}
          </p>

          <p className="mb-1">
            <strong>Chain Code:</strong> {chainCode || "N/A"}
          </p>

          <p className="mb-1">
            <strong>IATA Code:</strong> {iataCode || "N/A"}
          </p>

          <p className="mb-1">
            <strong>Latitude:</strong> {latitude ?? "N/A"}
          </p>

          <p className="mb-3">
            <strong>Longitude:</strong> {longitude ?? "N/A"}
          </p>
          <div className="text-end mt-3">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelModal;
