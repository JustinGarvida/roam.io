import React, { useState, useEffect } from "react";
import { supabase } from "../services/auth";

function PlansDashboard() {
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);

  let emptyForm = {
    name: "",
    from: "",
    to: "",
    budget: "",
    is_public: false,
    outbound: { airline: "", time: "", airport: "", cost: "" },
    inbound: { airline: "", time: "", airport: "", cost: "" },
    hotel: { name: "", nights: "", totalCost: "" },
  };

  const [formData, setFormData] = useState(emptyForm);
  const [showAddForm, setShowAddForm] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    }
    loadUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    async function loadPlans() {
      let { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("user_id", user.id);

      if (!error) setPlans(data);
    }
    loadPlans();
  }, [user]);

  let handleChange = (e, section) => {
    let { name, value } = e.target;

    if (section === "outbound" || section === "inbound" || section === "hotel") {
      setFormData({
        ...formData,
        [section]: { ...formData[section], [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  let toggleAddForm = (planId = "new") => {
    if (planId === "new") {
      setShowAddForm("new");
      setFormData(emptyForm);
    } else {
      let planToEdit = plans.find((p) => p.id === planId);
      setFormData(planToEdit);
      setShowAddForm(planId);
    }
  };

  let savePlan = async () => {
    if (!user) return alert("You must be logged in.");

    const payload = {
      user_id: user.id,
      name: formData.name,
      from: formData.from,
      to: formData.to,
      budget: formData.budget,
      is_public: formData.is_public,
      outbound: formData.outbound,
      inbound: formData.inbound,
      hotel: formData.hotel,
    };

    let data, error;

    if (showAddForm === "new") {
      const response = await supabase
        .from("plans")
        .insert([payload])
        .select()
        .single();

      data = response.data;
      error = response.error;

      if (!error) setPlans([...plans, data]);
    } else {
      const response = await supabase
        .from("plans")
        .update(payload)
        .eq("id", showAddForm)
        .select()
        .single();

      data = response.data;
      error = response.error;

      if (!error) {
        setPlans(plans.map((p) => (p.id === showAddForm ? data : p)));
      }
    }

    if (error) {
      console.error(error);
      alert("Error saving plan");
    }

    setShowAddForm(null);
    setFormData(emptyForm);
  };

  let handleViewPlan = (plan) => setSelectedPlan(plan);
  let closePopup = () => setSelectedPlan(null);

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-primary">Travel Plans</h1>

      <button className="btn btn-success mb-4" onClick={() => toggleAddForm("new")}>
        Add New Plan
      </button>

      {showAddForm && (
        <div className="p-3 border bg-light mb-4">
          <h5>{showAddForm === "new" ? "New Plan" : "Edit Plan"}</h5>

          <div className="row g-2 mb-2">
            <div className="col">
              <input
                type="text"
                name="name"
                placeholder="Plan Name"
                className="form-control"
                value={formData.name}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="col">
              <input
                type="text"
                name="from"
                placeholder="From"
                className="form-control"
                value={formData.from}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="col">
              <input
                type="text"
                name="to"
                placeholder="To"
                className="form-control"
                value={formData.to}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="col">
              <input
                type="number"
                name="budget"
                placeholder="Budget"
                className="form-control"
                value={formData.budget}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>

          <h6 className="mt-3">Outbound Flight</h6>
          <div className="row g-2 mb-2">
            <div className="col">
              <input
                type="text"
                name="airline"
                placeholder="Airline"
                className="form-control"
                value={formData.outbound.airline}
                onChange={(e) => handleChange(e, "outbound")}
              />
            </div>
            <div className="col">
              <input
                type="time"
                name="time"
                className="form-control"
                value={formData.outbound.time}
                onChange={(e) => handleChange(e, "outbound")}
              />
            </div>
            <div className="col">
              <input
                type="text"
                name="airport"
                placeholder="Airport"
                className="form-control"
                value={formData.outbound.airport}
                onChange={(e) => handleChange(e, "outbound")}
              />
            </div>
            <div className="col">
              <input
                type="number"
                name="cost"
                placeholder="Cost"
                className="form-control"
                value={formData.outbound.cost}
                onChange={(e) => handleChange(e, "outbound")}
              />
            </div>
          </div>

          <h6 className="mt-3">Return Flight</h6>
          <div className="row g-2 mb-2">
            <div className="col">
              <input
                type="text"
                name="airline"
                placeholder="Airline"
                className="form-control"
                value={formData.inbound.airline}
                onChange={(e) => handleChange(e, "inbound")}
              />
            </div>
            <div className="col">
              <input
                type="time"
                name="time"
                className="form-control"
                value={formData.inbound.time}
                onChange={(e) => handleChange(e, "inbound")}
              />
            </div>
            <div className="col">
              <input
                type="text"
                name="airport"
                placeholder="Airport"
                className="form-control"
                value={formData.inbound.airport}
                onChange={(e) => handleChange(e, "inbound")}
              />
            </div>
            <div className="col">
              <input
                type="number"
                name="cost"
                placeholder="Cost"
                className="form-control"
                value={formData.inbound.cost}
                onChange={(e) => handleChange(e, "inbound")}
              />
            </div>
          </div>

          <h6 className="mt-3">Hotel</h6>
          <div className="row g-2 mb-2">
            <div className="col">
              <input
                type="text"
                name="name"
                placeholder="Hotel Name"
                className="form-control"
                value={formData.hotel.name}
                onChange={(e) => handleChange(e, "hotel")}
              />
            </div>
            <div className="col">
              <input
                type="number"
                name="nights"
                placeholder="Nights"
                className="form-control"
                value={formData.hotel.nights}
                onChange={(e) => handleChange(e, "hotel")}
              />
            </div>
            <div className="col">
              <input
                type="number"
                name="totalCost"
                placeholder="Total Cost"
                className="form-control"
                value={formData.hotel.totalCost}
                onChange={(e) => handleChange(e, "hotel")}
              />
            </div>
          </div>

          <div className="form-check mt-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="isPublic"
              checked={formData.is_public}
              onChange={(e) =>
                setFormData({ ...formData, is_public: e.target.checked })
              }
            />
            <label className="form-check-label" htmlFor="isPublic">
              Make plan public
            </label>
          </div>

          <button className="btn btn-success mt-3" onClick={savePlan}>
            Save
          </button>
        </div>
      )}

      {plans.map((plan) => (
        <div key={plan.id} className="mb-4 p-3 border rounded">
          <h3>
            {plan.name}{" "}
            {plan.is_public && (
              <span className="badge bg-success">Public</span>
            )}
          </h3>

          <p>
            <strong>From:</strong> {plan.from} | <strong>To:</strong> {plan.to} |{" "}
            <strong>Budget:</strong> {plan.budget}
          </p>

          <button
            className="btn btn-primary btn-sm me-2"
            onClick={() => toggleAddForm(plan.id)}
          >
            Edit
          </button>

          <button
            className="btn btn-info btn-sm me-2"
            onClick={() => handleViewPlan(plan)}
          >
            View Details
          </button>

          {plan.is_public && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() =>
                navigator.clipboard.writeText(
                  `${window.location.origin}/plan/${plan.id}`
                )
              }
            >
              Copy Share Link
            </button>
          )}
        </div>
      ))}
      
      {selectedPlan && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">{selectedPlan.name} Details</h5>
                <button className="btn-close btn-close-white" onClick={closePopup}></button>
              </div>

              <div className="modal-body">
                <p><strong>From:</strong> {selectedPlan.from}</p>
                <p><strong>To:</strong> {selectedPlan.to}</p>
                <p><strong>Budget:</strong> {selectedPlan.budget}</p>

                <hr />

                <p>
                  <strong>Outbound:</strong> {selectedPlan.outbound.airline},{" "}
                  {selectedPlan.outbound.time},{" "}
                  {selectedPlan.outbound.airport},{" "}
                  {selectedPlan.outbound.cost}
                </p>

                <p>
                  <strong>Inbound:</strong> {selectedPlan.inbound.airline},{" "}
                  {selectedPlan.inbound.time},{" "}
                  {selectedPlan.inbound.airport},{" "}
                  {selectedPlan.inbound.cost}
                </p>

                <p>
                  <strong>Hotel:</strong> {selectedPlan.hotel.name},{" "}
                  {selectedPlan.hotel.nights} nights, Total:{" "}
                  {selectedPlan.hotel.totalCost}
                </p>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closePopup}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlansDashboard;
