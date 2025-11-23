import React, { useState } from "react";

function Flights() {
  let [flight, setFlight] = useState(null);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(null);

  let [origin, setOrigin] = useState("MAD");
  let [destination, setDestination] = useState("LON");

  async function fetchFlight() {
    setLoading(true);
    setError(null);
    try {
      let params = new URLSearchParams({ origin, destination });
      let response = await fetch(`http://localhost:4000/api/flights/cheapest-dates?${params}`);

      let data = await response.json();
      if (!data.data) {
        setError("No flight data found. Please try the following: MAD, LON, NYC, PAR, BCN");
      } else {
        setFlight(data.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch flight data. Please try the following: MAD, LON, NYC, PAR, BCN");
    } finally {
      setLoading(false);
    }
  }
  
  function handleSubmit(e) {
    e.preventDefault();
    fetchFlight();
  }
  
  return (
    <div class="container mt-5">
      <h1 class="mb-3">Cheapest Flight Search</h1>
      <p class="text-muted">Enter airports such as MAD (Madrid), LON (London), NYC (New York), PAR (Paris), BCN (Barcelona)</p>

      <form onSubmit={handleSubmit} class="mb-3">
        <div class="mb-2">
          <input
            type="text"
            class="form-control"
            placeholder="Origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value.toUpperCase())}
          />
        </div>
        <div class="mb-2">
          <input
            type="text"
            class="form-control"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value.toUpperCase())}
          />
        </div>
        <button type="submit" class="btn btn-primary w-100">
          Search
        </button>
      </form>

      {loading && <p>Loading cheapest flight...</p>}
      {error && <p class="text-danger">{error}</p>}

      {flight && (
        <div class="card mt-3">
          <div class="card-body">
            <h5 class="card-title">Cheapest Flight</h5>
            <p class="card-text">
              <strong>From:</strong> {flight.origin} <br/>
              <strong>To:</strong> {flight.destination} <br/>
              <strong>Departure:</strong> {flight.departureDate} <br/>
              {flight.returnDate && (
                <>
                  <strong>Return:</strong> {flight.returnDate} <br/>
                </>
              )}
              <strong>Price:</strong> ${flight.price} <br/>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Flights;
