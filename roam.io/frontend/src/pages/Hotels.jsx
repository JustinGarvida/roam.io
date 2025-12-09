import React, { useState } from "react";
import HotelCard from "../components/hotels/HotelCard";
import HotelModal from "../components/hotels/HotelModal";

const API_BASE = process.env.REACT_APP_API_BASE;

function Hotels() {
  const [location, setLocation] = useState("");
  const [miles, setMiles] = useState("10");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [budget, setBudget] = useState("");
  const [adults, setAdults] = useState("2");
  const [rooms, setRooms] = useState("1");

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const canSearch =
    location.trim() !== "" &&
    checkInDate.trim() !== "" &&
    checkOutDate.trim() !== "" &&
    adults.trim() !== "" &&
    rooms.trim() !== "" &&
    !(checkOutDate && checkInDate && checkOutDate < checkInDate);

  const handleCheckInChange = (e) => {
    const value = e.target.value;
    setCheckInDate(value);
    if (checkOutDate && checkOutDate < value) setCheckOutDate("");
  };

  const handleCheckOutChange = (e) => {
    const value = e.target.value;
    if (checkInDate && value < checkInDate) {
      setError("Check-out date cannot be before check-in date.");
      setCheckOutDate("");
      return;
    }
    setError("");
    setCheckOutDate(value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!canSearch) return;

    setHasSearched(true);
    setLoading(true);
    setError("");
    setHotels([]);

    try {
      const params = new URLSearchParams();

      const trimmedLocation = location.trim();
      if (/^\d{5}$/.test(trimmedLocation)) {
        params.append("zipCode", trimmedLocation);
      } else {
        params.append("location", trimmedLocation);
      }

      params.append("miles", miles);
      params.append("checkInDate", checkInDate);
      params.append("checkOutDate", checkOutDate);
      params.append("adults", adults);
      params.append("roomQuantity", rooms);

      const resp = await fetch(
        `${API_BASE}/api/hotels/cheapest?${params.toString()}`
      );
      if (!resp.ok) throw new Error(`Request failed with status ${resp.status}`);

      const data = await resp.json();
      let hotelsArray = Array.isArray(data.results) ? data.results : [];

      if (budget) {
        const budgetNum = Number(budget);
        hotelsArray = hotelsArray.filter((h) => {
          const price = Number(h.totalPrice);
          return Number.isNaN(price) || price <= budgetNum;
        });
      }

      setHotels(hotelsArray);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching hotels.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      {/* HEADER */}
      <div className="text-center mb-4">
        <h1 className="fw-bold">Find the Best Hotel Deals</h1>
        <p className="text-muted fs-6">
          Compare prices across thousands of hotels based on your travel dates
          and preferences.
        </p>
      </div>

      {/* FILTERS (RESPONSIVE GRID, NO BOX) */}
      <div className="mx-auto mb-4" style={{ maxWidth: "1100px" }}>
        <form
          className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 align-items-end"
          onSubmit={handleSearch}
        >
          <div className="col">
            <label className="form-label">City or ZIP *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Philadelphia or 19104"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="col">
            <label className="form-label">Radius (miles)</label>
            <input
              type="number"
              min="1"
              className="form-control"
              value={miles}
              onChange={(e) => setMiles(e.target.value)}
            />
          </div>

          <div className="col">
            <label className="form-label">Check-in *</label>
            <input
              type="date"
              className="form-control"
              value={checkInDate}
              onChange={handleCheckInChange}
            />
          </div>

          <div className="col">
            <label className="form-label">Check-out *</label>
            <input
              type="date"
              className="form-control"
              value={checkOutDate}
              min={checkInDate}
              onChange={handleCheckOutChange}
            />
          </div>

          <div className="col">
            <label className="form-label">Guests *</label>
            <input
              type="number"
              min="1"
              className="form-control"
              value={adults}
              onChange={(e) => setAdults(e.target.value)}
            />
          </div>

          <div className="col">
            <label className="form-label">Rooms *</label>
            <input
              type="number"
              min="1"
              className="form-control"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
            />
          </div>

          <div className="col">
            <label className="form-label">Max Budget (optional)</label>
            <input
              type="number"
              min="0"
              className="form-control"
              placeholder="e.g. 500"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>

          <div className="col d-flex">
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
            * Please fill in all required fields.
          </p>
        )}
      </div>

      {/* RESULTS */}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && hasSearched && hotels.length === 0 && !error && (
        <p className="text-muted fst-italic text-center">
          No hotels found for your criteria.
        </p>
      )}

      {/* ONE HOTEL PER ROW */}
      <div className="row">
        {hotels.map((hotel) => (
          <div
            className="col-12 mb-3"
            key={
              hotel.hotelId ||
              `${hotel.name}-${hotel.checkInDate}-${hotel.checkOutDate}`
            }
          >
            <HotelCard hotel={hotel} onClick={() => setSelectedHotel(hotel)} />
          </div>
        ))}
      </div>

      {selectedHotel && (
        <HotelModal
          hotel={selectedHotel}
          onClose={() => setSelectedHotel(null)}
        />
      )}
    </div>
  );
}

export default Hotels;
