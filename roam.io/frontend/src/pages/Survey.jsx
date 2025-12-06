// src/pages/Survey.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputQuestion from "../components/survey/InputQuestion";
import MultiChoiceWithOtherQuestion from "../components/survey/MultiChoiceWithOtherQuestion";
import DateQuestion from "../components/survey/DateQuestion";
import { generateTripFromSurvey } from "../services/tripGenerator";

function Survey() {
  const [formData, setFormData] = useState({
    destinationType: "",
    destinationTypeOther: "",
    budget: "",
    travelCompanions: "",
    activities: [],
    activitiesOther: "",
    climatePreference: "",
    travelVibe: "",
    departureCity: "",
    notes: "",
    tripStartDate: null,
    tripEndDate: null,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const setFieldValue = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // date validation
    if (!formData.tripStartDate || !formData.tripEndDate) {
      setMessage("Please select both a start and end date.");
      setLoading(false);
      return;
    }

    if (formData.tripEndDate < formData.tripStartDate) {
      setMessage("End date must be on or after the start date.");
      setLoading(false);
      return;
    }

    const formatDate = (d) =>
      d instanceof Date && !isNaN(d) ? d.toISOString().slice(0, 10) : null;

    const finalData = {
      destinationType:
        formData.destinationType === "other"
          ? formData.destinationTypeOther
          : formData.destinationType,
      budget: Number(formData.budget),
      travelCompanions: Number(formData.travelCompanions),
      activities: [
        ...(formData.activities || []),
        formData.activitiesOther ? `Other: ${formData.activitiesOther}` : null,
      ]
        .filter(Boolean)
        .join(", "),
      climatePreference: formData.climatePreference,
      travelVibe: formData.travelVibe,
      departureCity: formData.departureCity,
      notes: formData.notes,
      tripStartDate: formatDate(formData.tripStartDate),
      tripEndDate: formatDate(formData.tripEndDate),
    };

    try {
      console.log("Submitting survey:", finalData);

      // Call backend to generate location + plans
      const { location, plans } = await generateTripFromSurvey(finalData);

      // Redirect to GeneratedPlans page with the data
      navigate("/generated-plans", {
        state: {
          location,
          plans,
          survey: finalData,
        },
      });
    } catch (err) {
      console.error(err);
      setMessage("Error generating trip plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div
        className="card shadow-lg p-5"
        style={{ width: "700px", borderRadius: "12px" }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Find Your Perfect Getaway</h2>
          <p className="text-muted">
            Discover your next vacation by taking this survey!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="question-stack">
          {/* Destination type */}
          <div className="question-bubble">
            <MultiChoiceWithOtherQuestion
              label="Destination Type"
              name="destinationType"
              options={[
                { value: "beach", label: "Beach" },
                { value: "city", label: "City" },
                { value: "mountains", label: "Mountains" },
              ]}
              value={formData.destinationType}
              otherName="destinationTypeOther"
              otherValue={formData.destinationTypeOther}
              multiple={false}
              onChange={setFieldValue}
              required
            />
          </div>

          {/* Budget */}
          <div className="question-bubble">
            <InputQuestion
              label="Budget"
              name="budget"
              type="number"
              value={formData.budget}
              onChange={setFieldValue}
              placeholder="Enter your total budget (e.g. 2000)"
              min={0}
              required
            />
          </div>

          {/* Number of people */}
          <div className="question-bubble">
            <InputQuestion
              label="Number of People"
              name="travelCompanions"
              type="number"
              value={formData.travelCompanions}
              onChange={setFieldValue}
              placeholder="e.g. 2"
              min={1}
              required
            />
          </div>

          {/* Trip dates */}
          <div className="question-bubble">
            <DateQuestion
              label="When are you planning to travel?"
              startName="tripStartDate"
              endName="tripEndDate"
              startValue={formData.tripStartDate}
              endValue={formData.tripEndDate}
              onChange={setFieldValue}
            />
          </div>

          {/* Climate preference */}
          <div className="question-bubble">
            <MultiChoiceWithOtherQuestion
              label="Preferred Climate"
              name="climatePreference"
              options={[
                { value: "warm", label: "Warm & sunny" },
                { value: "mild", label: "Mild / temperate" },
                { value: "cold", label: "Cold / snowy" },
                { value: "noPreference", label: "No strong preference" },
              ]}
              value={formData.climatePreference}
              multiple={false}
              onChange={setFieldValue}
            />
          </div>

          {/* Trip vibe */}
          <div className="question-bubble">
            <MultiChoiceWithOtherQuestion
              label="Trip Vibe"
              name="travelVibe"
              options={[
                { value: "relax", label: "Relax & unwind" },
                { value: "mixed", label: "Mix of relaxing & exploring" },
                { value: "adventure", label: "Non-stop adventure" },
              ]}
              value={formData.travelVibe}
              multiple={false}
              onChange={setFieldValue}
            />
          </div>

          {/* Departure city */}
          <div className="question-bubble">
            <InputQuestion
              label="Departure City or Airport"
              name="departureCity"
              value={formData.departureCity}
              onChange={setFieldValue}
              placeholder="e.g. New York (JFK), Philadelphia, etc."
              required
            />
          </div>

          {/* Activities */}
          <div className="question-bubble">
            <MultiChoiceWithOtherQuestion
              label="Preferred Activities"
              name="activities"
              options={[
                { value: "Relaxing on the beach", label: "Relaxing on the beach" },
                { value: "Sightseeing & culture", label: "Sightseeing & culture" },
                { value: "Outdoor adventures", label: "Outdoor adventures" },
                {
                  value: "Nightlife & entertainment",
                  label: "Nightlife & entertainment",
                },
                { value: "Food & dining", label: "Food & dining" },
              ]}
              value={formData.activities}
              otherName="activitiesOther"
              otherValue={formData.activitiesOther}
              multiple={true}
              onChange={setFieldValue}
            />
          </div>

          {/* Notes */}
          <div className="question-bubble">
            <InputQuestion
              label="Any must-haves or restrictions?"
              name="notes"
              as="textarea"
              rows={3}
              value={formData.notes}
              onChange={setFieldValue}
              placeholder="e.g. Kid-friendly, no long flights, avoid extreme heat, love street food, etc."
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mt-4"
            disabled={loading}
          >
            {loading ? "Generating your trip..." : "Submit"}
          </button>
        </form>

        {message && (
          <div className="alert alert-info text-center mt-4" role="alert">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Survey;
