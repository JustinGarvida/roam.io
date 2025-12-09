import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100">
      <section
        className="d-flex align-items-center justify-content-center text-center text-white"
        style={{
          minHeight: "70vh",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <h1 className="display-4 fw-bold mb-3">
            Plan Your Dream Trip{" "}
            <i className="bi bi-globe-americas fs-1 text-primary ms-1"></i>
          </h1>

          <p className="lead mb-4">
            Personalized flights, hotels, attractions, and maps — tailored just for you.
          </p>

          {/* SINGLE PRIMARY CTA */}
          <button
            onClick={() => navigate("/survey")}
            className="btn btn-primary btn-lg px-4 shadow"
          >
            Find Your Next Vacation
          </button>
        </div>
      </section>

      <main className="flex-grow-1">

        {/* ======================= */}
        {/* HOW IT WORKS SECTION     */}
        {/* ======================= */}
        <section className="py-5 bg-light">
          <div className="container">
            <h2 className="fw-bold mb-4 text-center">How It Works</h2>

            <div className="row row-cols-1 row-cols-md-3 g-4">
              <div className="col">
                <div className="card border-0 shadow-sm p-4 h-100">
                  <h5 className="fw-bold mb-2">1. Take a Quick Survey</h5>
                  <p className="text-muted mb-0">
                    Tell us your travel vibe, budget, dates, and preferences.
                  </p>
                </div>
              </div>

              <div className="col">
                <div className="card border-0 shadow-sm p-4 h-100">
                  <h5 className="fw-bold mb-2">2. AI Generates Your Trip</h5>
                  <p className="text-muted mb-0">
                    Instantly get hotels, flights, and attraction recommendations.
                  </p>
                </div>
              </div>

              <div className="col">
                <div className="card border-0 shadow-sm p-4 h-100">
                  <h5 className="fw-bold mb-2">3. Save, Share & Explore</h5>
                  <p className="text-muted mb-0">
                    Review, save, and prepare to book your perfect vacation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="my-4"></div>

        <section className="py-5">
          <div className="container">
            <div className="row align-items-center g-4">
              
              <div className="col-12 col-lg-6">
                <h2 className="fw-bold mb-3">Smart Hotel Search</h2>
                <p className="text-muted mb-3">
                  Compare real-time hotel prices around any location. Perfect for flexible
                  travel planning.
                </p>

                <ul className="text-muted mb-4">
                  <li>Search by city or ZIP code</li>
                  <li>Price filtering & date-based availability</li>
                  <li>Clean, responsive hotel results layout</li>
                </ul>

                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/hotels")}
                >
                  Explore Hotel Deals
                </button>
              </div>

              <div className="col-12 col-lg-6">
                <div className="card border-0 shadow-sm p-4">
                  <h5 className="fw-semibold mb-3">Hotel Search Preview</h5>

                  <div className="row g-2">
                    <div className="col-6">
                      <span className="form-label small">City or ZIP</span>
                      <div className="form-control form-control-sm">Philadelphia</div>
                    </div>
                    <div className="col-3">
                      <span className="form-label small">Check-in</span>
                      <div className="form-control form-control-sm">2025-06-01</div>
                    </div>
                    <div className="col-3">
                      <span className="form-label small">Check-out</span>
                      <div className="form-control form-control-sm">2025-06-05</div>
                    </div>
                  </div>

                  <div className="mt-3 d-flex justify-content-between align-items-center">
                    <div className="small text-muted">
                      Guests: <strong>2</strong> • Rooms: <strong>1</strong>
                    </div>
                    <button className="btn btn-primary btn-sm" disabled>
                      Search (Demo)
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <div className="my-4"></div>

        <section className="py-5 bg-light">
          <div className="container">
            <div className="row align-items-center g-4 flex-lg-row-reverse">

              <div className="col-12 col-lg-6">
                <h2 className="fw-bold mb-3">Cheapest Flight Finder</h2>
                <p className="text-muted mb-3">
                  Search the lowest-cost flight dates instantly using IATA airport codes.
                </p>

                <ul className="text-muted mb-4">
                  <li>Find cheapest routes between major cities</li>
                  <li>Minimal input, fast results</li>
                  <li>Perfect for flexible travel dates</li>
                </ul>

                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/flights")}
                >
                  Search Flights
                </button>
              </div>

              <div className="col-12 col-lg-6">
                <div className="card border-0 shadow-sm p-4">
                  <h5 className="fw-semibold mb-3">Flight Search Preview</h5>

                  <div className="row g-2">
                    <div className="col-6">
                      <span className="form-label small">Origin</span>
                      <div className="form-control form-control-sm">MAD</div>
                    </div>
                    <div className="col-6">
                      <span className="form-label small">Destination</span>
                      <div className="form-control form-control-sm">LON</div>
                    </div>
                  </div>

                  <div className="mt-3 d-flex justify-content-between">
                    <span className="small text-muted">Sample lowest fare:</span>
                    <button className="btn btn-primary btn-sm" disabled>
                      Search (Demo)
                    </button>
                  </div>

                  <div className="mt-2 border-top pt-2 d-flex justify-content-between">
                    <span className="small">MAD → LON</span>
                    <span className="fw-bold">$123.45</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      <footer className="py-4 text-center bg-primary text-white mt-auto">
        <div className="container">
          <p className="mb-1">
            &copy; {new Date().getFullYear()} roam.io · All rights reserved
          </p>
          <small>Plan smarter. Travel better.</small>
        </div>
      </footer>

    </div>
  );
}

export default Home;
