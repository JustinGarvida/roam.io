import React from "react";

function HotelCard({ hotel, onClick }) {
  const {
    hotelId,
    name,
    chainCode,
    iataCode,
    latitude,
    longitude,
    address,
    city,
    countryCode,
  } = hotel;

  const handleClick = () => {
    if (onClick) {
      onClick(hotel);
    }
  };

  return (
    <div
      className="card mb-3 shadow-sm h-100"
      onClick={handleClick}
      role="button"
      style={{ cursor: "pointer" }}
      data-hotel-id={hotelId}
      data-chain-code={chainCode}
      data-iata-code={iataCode}
      data-latitude={latitude}
      data-longitude={longitude}
    >
      <div className="card-body">
        <h5 className="card-title mb-2">
          {name || "Unnamed Hotel"}
        </h5>

        <h6 className="card-subtitle mb-2 text-muted">
          {address && <span>{address}</span>}
          {(city || countryCode) && (
            <>
              {address && ", "}
              {city && <span>{city}</span>}
              {city && countryCode && ", "}
              {countryCode && <span>{countryCode}</span>}
            </>
          )}
        </h6>
      </div>
    </div>
  );
}

export default HotelCard;
