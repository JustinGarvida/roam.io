import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// test push to see if username appears now
function Home() {
  return (
    <div>
      <section
      class="d-flex align-items-center justify-content-center text-center text-white"
      style={{
        height: "100vh",
        backgroundImage:
        "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
        <div>
          <h1 class="display-4 fw-bold mb-3">Plan Your Dream Trip <i class="bi bi-globe-americas fs-1 text-primary mb-3"></i></h1>
          <p class="lead mb-4">Get your flights, hotels, attractions, and maps tailored to your travel style.</p>
          <button onClick={() => alert("This should redirect to the Survey")}
          class="btn btn-primary btn-lg px-4 shadow">Start Your Vacation Here</button>
        </div>
      </section>

      <section class="py-5 text-center">
        <div>
          <h2 class="fw-bold mb-4">Your Personalized Travel Plan Includes</h2>
        </div>
         <div class="row text-center mx-2">
          <div class="col-3">
            <div class="card border-0 shadow p-4 h-100">
              <i class="bi bi-airplane fs-1 text-primary mb-3"></i>
              <h5 class="fw-bold">Flights</h5>
              <p class="text-muted">Find the best flight options for your travels.</p>
            </div>
          </div>
          <div class="col-3">
            <div class="card border-0 shadow p-4 h-100">
              <i class="bi bi-building fs-1 text-primary mb-3"></i>
              <h5 class="fw-bold">Lodging</h5>
              <p class="text-muted">Comfortable stays and hotels for your vibe.</p>
            </div>
          </div>
          <div class="col-3">
            <div class="card border-0 shadow p-4 h-100">
              <i class="bi bi-tree fs-1 text-primary mb-3"></i>
              <h5 class="fw-bold">Attractions</h5>
              <p class="text-muted">Discover landmarks, restaurants, and hidden gems.</p>
            </div>
          </div>
          <div class="col-3">
            <div class="card border-0 shadow p-4 h-100">
              <i class="bi bi-map fs-1 text-primary mb-3"></i>
              <h5 class="fw-bold">Map View</h5>
              <p class="text-muted">Visualize your journey with location pins and routes.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="py-5 text-center">
        <div>
          <h2 class="fw-bold mb-4">How It Works</h2>
        </div>
         <div class="row text-center mx-2">
          <div class="col-3">
            <div class="card border-0 shadow p-4 h-100">
              <h5 class="fw-bold">1. Take a Quick Survey</h5>
              <p>Tell us about your travel style, budget, and dream desinations.</p>
            </div>
          </div>
          <div class="col-3">
            <div class="card border-0 shadow p-4 h-100">
              <h5 class="fw-bold">2. Get a Personalized Plan</h5>
              <p>We will generate flights, lodging, and attraction recommendations.</p>
            </div>
          </div>
          <div class="col-3">
            <div class="card border-0 shadow p-4 h-100">
              <h5 class="fw-bold">3. Take a Quick Survey</h5>
              <p>View, save, and edit your planned trips with ease.</p>
            </div>
          </div>
          <div class="col-3">
            <div class="card border-0 shadow p-4 h-100">
              <h5 class="fw-bold">4. Share and Sync</h5>
              <p>Export your trip to a calendar to share with others.</p>
            </div>
          </div>
        </div>
      </section>

      <footer class="py-4 text-center bg-primary text-white">
        <div>
          <p class="mb-0">Copyright &copy; 2025 roam.io | All rights reserved</p>
          <small>Plan smarter. Travel better.</small>
        </div>
      </footer>
    </div>
  );
}

export default Home;
