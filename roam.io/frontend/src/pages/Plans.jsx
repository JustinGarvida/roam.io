import React, { useState, useEffect } from "react";
import { supabase } from "../services/auth";
import { useNavigate } from "react-router-dom";

function PlansDashboard() {
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const emptyForm = {
    name: "",
    from: "",
    to: "",
    budget: "",
    is_public: false,
    outbound: { airline: "", date: "", time: "", airport: "", cost: "" },
    inbound: { airline: "", date: "", time: "", airport: "", cost: "" },
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
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("user_id", user.id);

      if (!error) setPlans(data);
    }

    loadPlans();
  }, [user]);

  const handleChange = (e, section) => {
    const { name, value } = e.target;

    if (["outbound", "inbound", "hotel"].includes(section)) {
      setFormData({
        ...formData,
        [section]: { ...formData[section], [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const toggleAddForm = (planId = "new") => {
    if (planId === "new") {
      setFormData(emptyForm);
      setShowAddForm("new");
    } else {
      const planToEdit = plans.find((p) => p.id === planId);
      setFormData(planToEdit);
      setShowAddForm(planId);
    }
  };

  const savePlan = async () => {
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
      const res = await supabase.from("plans").insert([payload]).select().single();
      data = res.data;
      error = res.error;
      if (!error) setPlans([...plans, data]);
    } else {
      const res = await supabase
        .from("plans")
        .update(payload)
        .eq("id", showAddForm)
        .select()
        .single();

      data = res.data;
      error = res.error;

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

  const handleViewPlan = (plan) => setSelectedPlan(plan);
  const closePopup = () => setSelectedPlan(null);

  return (
    <div className="container py-5">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold text-dark">My Plans</h1>

        <div>
          <button className="btn btn-primary me-2" onClick={() => toggleAddForm("new")}>
          Add New Plan
          </button>

          <button className="btn btn-primary" onClick={() => navigate("/calendar")}>
            My Calendar
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="p-4 mb-4 bg-light rounded shadow-sm border">
          <h4 className="fw-bold text-dark mb-3">
            {showAddForm === "new" ? "Create New Plan" : "Edit Plan"}
          </h4>

          <div className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                name="name"
                placeholder="Plan Name"
                className="form-control"
                value={formData.name}
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div className="col-md-3">
              <input
                type="text"
                name="from"
                placeholder="From"
                className="form-control"
                value={formData.from}
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div className="col-md-3">
              <input
                type="text"
                name="to"
                placeholder="To"
                className="form-control"
                value={formData.to}
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div className="col-md-3">
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

          {/* Outbound */}
          <h5 className="mt-4 text-dark">Outbound Flight</h5>
          <div className="row g-3">
            {["airline", "airport", "cost"].map((f) => (
              <div key={f} className="col-md-3">
                <input
                  type={f === "cost" ? "number" : "text"}
                  name={f}
                  placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                  className="form-control"
                  value={formData.outbound[f] || ""}
                  onChange={(e) => handleChange(e, "outbound")}
                />
              </div>
            ))}
            <div className="col-md-3">
              <input
                type="date"
                name="date"
                className="form-control"
                value={formData.outbound.date || ""}
                onChange={(e) => handleChange(e, "outbound")}
              />
            </div>
            <div className="col-md-3">
              <input
                type="time"
                name="time"
                className="form-control"
                value={formData.outbound.time}
                onChange={(e) => handleChange(e, "outbound")}
              />
            </div>
          </div>

          <h5 className="mt-4 text-dark">Return Flight</h5>
          <div className="row g-3">
            {["airline", "airport", "cost"].map((f) => (
              <div key={f} className="col-md-3">
                <input
                  type={f === "cost" ? "number" : "text"}
                  name={f}
                  placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                  className="form-control"
                  value={formData.inbound[f] || ""}
                  onChange={(e) => handleChange(e, "inbound")}
                />
              </div>
            ))}
            <div className="col-md-3">
              <input
                type="date"
                name="date"
                className="form-control"
                value={formData.inbound.date || ""}
                onChange={(e) => handleChange(e, "inbound")}
              />
            </div>
            <div className="col-md-3">
              <input
                type="time"
                name="time"
                className="form-control"
                value={formData.inbound.time}
                onChange={(e) => handleChange(e, "inbound")}
              />
            </div>
          </div>

          <h5 className="mt-4 text-dark">Hotel</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                name="name"
                placeholder="Hotel Name"
                className="form-control"
                value={formData.hotel.name}
                onChange={(e) => handleChange(e, "hotel")}
              />
            </div>
            <div className="col-md-4">
              <input
                type="number"
                name="nights"
                placeholder="Nights"
                className="form-control"
                value={formData.hotel.nights}
                onChange={(e) => handleChange(e, "hotel")}
              />
            </div>
            <div className="col-md-4">
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

          <button className="btn btn-primary mt-4" onClick={savePlan}>
            Save Plan
          </button>
        </div>
      )}

      {plans.map((plan) => (
        <div key={plan.id} className="p-4 mb-4 border rounded shadow-sm">
          <h4 className="fw-bold text-dark">
            {plan.name}{" "}
            {plan.is_public && (
              <span className="badge bg-primary ms-1">Public</span>
            )}
          </h4>

          <p className="mb-2">
            <strong>From:</strong> {plan.from} &nbsp; | &nbsp;
            <strong>To:</strong> {plan.to} &nbsp; | &nbsp;
            <strong>Budget:</strong> ${plan.budget}
          </p>

          <button
            className="btn btn-primary btn-sm me-2"
            onClick={() => toggleAddForm(plan.id)}
          >
            Edit
          </button>

          <button
            className="btn btn-primary btn-sm me-2"
            onClick={() => handleViewPlan(plan)}
          >
            View Details
          </button>

          {plan.is_public && (
            <button
              className="btn btn-primary btn-sm"
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
          style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">{selectedPlan.name} Details</h5>
                <button className="btn-close btn-close-white" onClick={closePopup}></button>
              </div>

              <div className="modal-body">
                <p><strong>From:</strong> {selectedPlan.from}</p>
                <p><strong>To:</strong> {selectedPlan.to}</p>
                <p><strong>Budget:</strong> ${selectedPlan.budget}</p>

                <hr />

                <p>
                  <strong>Outbound:</strong> {selectedPlan.outbound.airline},{" "}
                  {selectedPlan.outbound.time}, {selectedPlan.outbound.airport},{" "}
                  ${selectedPlan.outbound.cost}
                </p>

                <p>
                  <strong>Inbound:</strong> {selectedPlan.inbound.airline},{" "}
                  {selectedPlan.inbound.time}, {selectedPlan.inbound.airport},{" "}
                  ${selectedPlan.inbound.cost}
                </p>

                <p>
                  <strong>Hotel:</strong> {selectedPlan.hotel.name},{" "}
                  {selectedPlan.hotel.nights} nights — ${selectedPlan.hotel.totalCost}
                </p>
              </div>

              <div className="modal-footer">
                <button className="btn btn-primary" onClick={closePopup}>
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
