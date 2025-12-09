import React from "react";

function HotelCard({ hotel, onClick }) {
  const {
    hotelId,
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

  const handleClick = () => {
    if (onClick) onClick(hotel);
  };

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

  return (
    <div
      className="card mb-3 shadow-sm h-100 border-0"
      onClick={handleClick}
      role="button"
      style={{ cursor: "pointer" }}
      data-hotel-id={hotelId}
    >
      <div className="card-body d-flex justify-content-between align-items-start">
        {/* Left column */}
        <div className="me-3">
          <h5 className="card-title mb-1 fw-semibold">
            {name || "Unnamed Hotel"}
          </h5>

          <p className="mb-2 text-muted small">
            <i className="bi bi-geo-alt-fill me-1" aria-hidden="true" />
            {fullAddress}
          </p>

          {/* SEPARATE CHECK-IN & CHECK-OUT LINES */}
          {checkInDate && (
            <p className="mb-1 small">
              <strong>Check-in:</strong> {checkInDate}
            </p>
          )}
          {checkOutDate && (
            <p className="mb-2 small">
              <strong>Check-out:</strong> {checkOutDate}
            </p>
          )}

          {(adults || roomQuantity) && (
            <p className="mb-0 small text-muted">
              <strong>Guests:</strong> {adults || 1} •{" "}
              <strong>Rooms:</strong> {roomQuantity || 1}
            </p>
          )}
        </div>

        {/* Right column: Price */}
        <div className="text-end">
          <div className="fw-bold fs-5">{formattedPrice}</div>
          <div className="small text-muted">Total Price</div>
        </div>
      </div>
    </div>
  );
}

export default HotelCard;
