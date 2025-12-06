// src/pages/GeneratedPlans.jsx
import React, { useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000";

function GeneratedPlans() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [miles, setMiles] = useState("10");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState("1");
  const [roomQuantity, setRoomQuantity] = useState("1");

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setHasSearched(true);
    setError("");
    setLoading(true);
    setTrips([]);

    try {
      const payload = {
        origin: origin.trim(),
        destination: destination.trim(),
        zipCode: zipCode.trim(),
        miles: miles ? Number(miles) : undefined,
        checkInDate: checkInDate || undefined,
        checkOutDate: checkOutDate || undefined,
        adults: adults ? Number(adults) : 1,
        roomQuantity: roomQuantity ? Number(roomQuantity) : 1,
      };

      const resp = await fetch(`${API_BASE}/api/plans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        throw new Error(`Request failed with status ${resp.status}`);
      }

      const data = await resp.json();
      const tripsArray = Array.isArray(data.trips) ? data.trips : [];
      setTrips(tripsArray);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while generating trips.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Generate Travel Plans</h1>

      <form className="row g-3 mb-4" onSubmit={handleSearch}>
        <div className="col-md-3">
          <label className="form-label">Origin (IATA)</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. PHL"
            value={origin}
            onChange={(e) => setOrigin(e.target.value.toUpperCase())}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Destination (IATA)</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. NYC"
            value={destination}
            onChange={(e) => setDestination(e.target.value.toUpperCase())}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Hotel ZIP</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. 10001"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Radius (miles)</label>
          <input
            type="number"
            min="1"
            className="form-control"
            value={miles}
            onChange={(e) => setMiles(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Check-in Date</label>
          <input
            type="date"
            className="form-control"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Check-out Date</label>
          <input
            type="date"
            className="form-control"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label">Adults</label>
          <input
            type="number"
            min="1"
            className="form-control"
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label">Rooms</label>
          <input
            type="number"
            min="1"
            className="form-control"
            value={roomQuantity}
            onChange={(e) => setRoomQuantity(e.target.value)}
          />
        </div>

        <div className="col-md-2 d-flex align-items-end">
          <button
            type="submit"
            className="btn btn-dark w-100"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </form>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && hasSearched && trips.length === 0 && !error && (
        <p className="text-muted fst-italic">No trips found.</p>
      )}

      {/* Trip results */}
      <div className="row">
        {trips.map((trip, idx) => (
          <div className="col-md-6 col-lg-4 mb-3" key={idx}>
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">
                  Trip to {trip.destination || trip.hotel?.city || "Destination"}
                </h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {trip.checkInDate} → {trip.checkOutDate}
                </h6>

                <p className="mb-2">
                  <strong>Total:</strong>{" "}
                  {trip.currency || "USD"}{" "}
                  {trip.totalTripPrice != null
                    ? trip.totalTripPrice.toFixed(2)
                    : "N/A"}
                </p>

                {/* Flight details */}
                {trip.flight && (
                  <div className="mb-2">
                    <h6 className="fw-bold mb-1">Flight</h6>
                    <p className="mb-1">
                      {trip.flight.origin} → {trip.flight.destination}
                    </p>
                    <p className="mb-1">
                      <small>
                        Depart: {trip.flight.departureDate} | Return:{" "}
                        {trip.flight.returnDate}
                      </small>
                    </p>
                    <p className="mb-1">
                      <small>
                        Flight Price: {trip.currency || "USD"}{" "}
                        {trip.flight.price}
                      </small>
                    </p>
                  </div>
                )}

                {/* Hotel details */}
                {trip.hotel && (
                  <div className="mt-auto">
                    <h6 className="fw-bold mb-1">Hotel</h6>
                    <p className="mb-1">{trip.hotel.name}</p>
                    <p className="mb-1">
                      <small>
                        {trip.hotel.address}
                        {trip.hotel.city ? `, ${trip.hotel.city}` : ""}{" "}
                        {trip.hotel.countryCode ? `(${trip.hotel.countryCode})` : ""}
                      </small>
                    </p>
                    <p className="mb-0">
                      <small>
                        Hotel Price: {trip.hotel.currency || trip.currency || "USD"}{" "}
                        {trip.hotel.totalPrice}
                      </small>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GeneratedPlans;
