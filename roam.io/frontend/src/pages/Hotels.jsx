// src/pages/Hotels.jsx
import React, { useState } from "react";
import HotelCard from "../components/hotels/HotelCard";
import HotelModal from "../components/hotels/HotelModal";


const API_BASE = process.env.REACT_APP_API_BASE
// const API_BASE = "https://roam-io-backend.vercel.app";
console.log(API_BASE)
const PAGE_SIZE = 20; 

function Hotels() {
  const [location, setLocation] = useState("");
  const [miles, setMiles] = useState("10");
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = async (e) => {
    e.preventDefault();

    setHasSearched(true);
    setError("");
    setLoading(true);
    setHotels([]);

    try {
      const params = new URLSearchParams();
      if (location.trim()) params.append("location", location.trim());
      if (miles) params.append("miles", miles);

      const resp = await fetch(`${API_BASE}/api/hotels?${params.toString()}`);

      if (!resp.ok) {
        throw new Error(`Request failed with status ${resp.status}`);
      }

      const data = await resp.json();

      const hotelsArray = Array.isArray(data.results) ? data.results : [];
      setHotels(hotelsArray);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching hotels.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (hotel) => {
    setSelectedHotel(hotel);
  };

  const handleCloseModal = () => {
    setSelectedHotel(null);
  };

  const totalPages = Math.ceil(hotels.length / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleHotels = hotels.slice(startIndex, startIndex + PAGE_SIZE);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Search Hotels</h1>

      <form className="row g-3 mb-4" onSubmit={handleSearch}>
        <div className="col-md-5">
          <label className="form-label">City or ZIP</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Philadelphia or 19104"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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

        <div className="col-md-2 d-flex align-items-end">
          <button
            type="submit"
            className="btn btn-dark w-100"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && hasSearched && hotels.length === 0 && !error && (
        <p className="text-muted fst-italic">No hotels found.</p>
      )}

      {/* Results */}
      <div className="row">
        {visibleHotels.map((hotel) => (
          <div
            className="col-sm-6 col-md-4 col-lg-3 mb-3"
            key={
              hotel.hotelId ||
              `${hotel.name}-${hotel.latitude}-${hotel.longitude}`
            }
          >
            <HotelCard hotel={hotel} onClick={handleCardClick} />
          </div>
        ))}
      </div>

      {hotels.length > PAGE_SIZE && (
        <nav aria-label="Hotel pagination">
          <ul className="pagination justify-content-center mt-3">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => goToPage(currentPage - 1)}>
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li
                key={page}
                className={`page-item ${page === currentPage ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => goToPage(page)}>
                  {page}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button className="page-link" onClick={() => goToPage(currentPage + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {selectedHotel && (
        <HotelModal hotel={selectedHotel} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default Hotels;
