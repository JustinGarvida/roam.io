import React, { useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE;
// const API_BASE = "http://localhost:4000";

function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [origin, setOrigin] = useState("MAD");
  const [destination, setDestination] = useState("LON");

  const canSearch = origin.trim() !== "" && destination.trim() !== "";

  async function fetchFlight() {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ origin, destination });
      const response = await fetch(
        `${API_BASE}/api/flights/cheapest-dates?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || `Request failed with status ${response.status}`
        );
      }

      if (!data.data || data.data.length === 0) {
        setError(
          "No flight data found. Try airports like MAD, LON, NYC, PAR, or BCN."
        );
        setFlights([]);
      } else {
        setFlights(data.data);
      }
    } catch (err) {
      console.error(err);
      setError(
        "Failed to fetch flight data. Try airports like MAD, LON, NYC, PAR, or BCN."
      );
      setFlights([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSearch) return;
    fetchFlight();
  }

  return (
    <div className="container py-4">
      {/* TITLE + DESCRIPTION */}
      <div className="text-center mb-4">
        <h1 className="fw-bold">Find the Cheapest Flights</h1>
        <p className="text-muted fs-6">
          Search for the lowest fares between popular airports and discover the
          best dates for your trip.
        </p>
      </div>

      {/* FILTERS (NO BOX, FULL-WIDTH LAYOUT) */}
      <div className="mx-auto mb-4" style={{ maxWidth: "900px" }}>
        <h5 className="fw-semibold mb-2">Search Filters</h5>
        <p className="text-muted small mb-3">
          Use IATA airport codes like <strong>MAD</strong> (Madrid),{" "}
          <strong>LON</strong> (London), <strong>NYC</strong> (New York),{" "}
          <strong>PAR</strong> (Paris), <strong>BCN</strong> (Barcelona).
        </p>

        <form className="row g-4" onSubmit={handleSubmit}>
          <div className="col-md-5">
            <label className="form-label">Origin Airport *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. MAD"
              value={origin}
              onChange={(e) => setOrigin(e.target.value.toUpperCase())}
            />
          </div>

          <div className="col-md-5">
            <label className="form-label">Destination Airport *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. LON"
              value={destination}
              onChange={(e) => setDestination(e.target.value.toUpperCase())}
            />
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={!canSearch || loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {!canSearch && (
          <p className="text-danger small mt-2">
            * Please fill in both origin and destination.
          </p>
        )}
      </div>

      {/* ERROR / LOADING */}
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {loading && (
        <p className="text-center text-muted">
          Loading cheapest flight options…
        </p>
      )}

      {/* RESULTS */}
      <div className="row">
        {flights.map((flight, index) => (
          <div className="col-12 mb-3" key={index}>
            <div className="card shadow-sm border-0">
              <div className="card-body d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="card-title mb-2">
                    {flight.origin} → {flight.destination}
                  </h5>
                  <p className="mb-1">
                    <span className="fw-semibold">Departure:</span>{" "}
                    {flight.departureDate}
                  </p>
                  {flight.returnDate && (
                    <p className="mb-1">
                      <span className="fw-semibold">Return:</span>{" "}
                      {flight.returnDate}
                    </p>
                  )}
                </div>
                <div className="text-end">
                  <div className="fw-bold fs-5">
                    {flight.price
                      ? `$${Number(flight.price).toFixed(2)}`
                      : "N/A"}
                  </div>
                  <div className="small text-muted">Cheapest found</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && !error && flights.length === 0 && (
        <p className="text-muted fst-italic text-center">
          No results yet. Enter an origin and destination to start searching.
        </p>
      )}
    </div>
  );
}

export default Flights;
