import React, { useState } from "react";


function Survey() {
  let [formData, setFormData] = useState({
    name: "",
    destinationType: "",
    budget: "",
    travelCompanions: "",
    activities: "",
  });

  let [message, setMessage] = useState("");
  let [loading, setLoading] = useState(false);

  let handleChange = (e) => {
    let { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  let handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

      try {
    let res = await fetch("http://localhost:4000/api/survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    let data = await res.json();
    alert(data.message);
  } catch (err) {
    console.error(err);
    alert("Error submitting survey");
  }
    setLoading(false);
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "500px" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Vacation Survey</h2>
          <p className="text-muted">Fill this out to plan you're vacation</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Your Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name here"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Destination Type</label>
            <select
              name="destinationType"
              className="form-select"
              value={formData.destinationType}
              onChange={handleChange}
              required
            >
              <option value="">Select one...</option>
              <option value="beach">Beach</option>
              <option value="city">City</option>
              <option value="mountain">Mountains</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Budget ($)</label>
            <input
              type="number"
              name="budget"
              className="form-control"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Example: 2000"
              min="0"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Amount of People</label>
            <input
              type="number"
              name="travelCompanions"
              className="form-control"
              value={formData.travelCompanions}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Preferred Activities</label>
            <textarea
              name="activities"
              className="form-control"
              value={formData.activities}
              onChange={handleChange}
              placeholder="What do you want to do."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {message && (
          <div className="alert alert-info text-center mt-3" role="alert">
            {message}
          </div>
        )}

        <div className="text-center mt-3">
          <small className="text-muted">
          </small>
        </div>
      </div>
    </div>
  );
}

export default Survey;