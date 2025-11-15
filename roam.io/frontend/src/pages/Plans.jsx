import React, { useState } from "react";

function PlansDashboard() {
  let [plans, setPlans] = useState([
    {
      id: 1,
      name: "Plan 1",
      from: "Philadelphia",
      to: "San Francisco",
      budget: "$1200",
      outbound: { airline: "AA", time: "08:00 AM", airport: "CC", cost: "$300" },
      inbound: { airline: "AA", time: "06:00 PM", airport: "DD", cost: "$300" },
      hotel: { name: "hotel1", nights: 3, totalCost: "$600" },
    },
    {
      id: 2,
      name: "Plan 2",
      from: "New York",
      to: "Tokyo",
      budget: "$2500",
      outbound: { airline: "BB", time: "10:00 AM", airport: "EE", cost: "$800" },
      inbound: { airline: "BB", time: "05:00 PM", airport: "EE", cost: "$800" },
      hotel: { name: "hotel2", nights: 4, totalCost: "$900" },
    },
  ]);

  let emptyForm = {
    name: "",
    from: "",
    to: "",
    budget: "",
    outbound: { airline: "", time: "", airport: "", cost: "" },
    inbound: { airline: "", time: "", airport: "", cost: "" },
    hotel: { name: "", nights: "", totalCost: "" },
  };

  let [formData, setFormData] = useState(emptyForm);
  let [showAddForm, setShowAddForm] = useState(null);
  let [selectedPlan, setSelectedPlan] = useState(null);

  let handleChange = (e, section) => {
    let { name, value } = e.target;
    if (section === "outbound" || section === "inbound" || section === "hotel") {
      setFormData({ ...formData, [section]: { ...formData[section], [name]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  let toggleAddForm = (planId = "new") => {
    if (planId === "new") {
      setShowAddForm(showAddForm === "new" ? null : "new");
      setFormData(emptyForm);
    } else {
      let planToEdit = plans.find((p) => p.id === planId);
      setFormData(planToEdit);
      setShowAddForm(planId);
    }
  };

  let savePlan = () => {
    if (showAddForm === "new") {
      let newPlan = { ...formData, id: Date.now() };
      setPlans([...plans, newPlan]);
    } else {
      setPlans(plans.map((p) => (p.id === showAddForm ? { ...p, ...formData } : p)));
    }
    setShowAddForm(null);
    setFormData(emptyForm);
  };

  let handleViewPlan = (plan) => {
    setSelectedPlan(plan);
  };

  let closePopup = () => {
    setSelectedPlan(null);
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-primary">Travel Plans</h1>

      <button className="btn btn-success mb-4" onClick={() => toggleAddForm("new")}>
        {showAddForm === "new" ? "Cancel Add" : "Add New Plan"}
      </button>

      {showAddForm && (
        <div className="p-3 border bg-light mb-4">
          <h5>{showAddForm === "new" ? "New Plan" : "Edit Plan"}</h5>


<div className="row g-2 mb-2">
  <div className="col">
    <input type="text" name="name" placeholder="Plan Name" className="form-control" value={formData.name} onChange={(e) => handleChange(e)} />
  </div>
  <div className="col">
    <input type="text" name="from" placeholder="From" className="form-control" value={formData.from} onChange={(e) => handleChange(e)} />
  </div>
  <div className="col">
    <input type="text" name="to" placeholder="To" className="form-control" value={formData.to} onChange={(e) => handleChange(e)} />
  </div>
  <div className="col">
    <input type="number" min="0" step="0.01" name="budget" placeholder="Budget" className="form-control" value={formData.budget} onChange={(e) => handleChange(e)} />
  </div>
</div>


<div className="row g-2 mb-2">
  <div className="col">
    <input type="text" name="airline" placeholder="Airline" className="form-control" value={formData.outbound.airline} onChange={(e) => handleChange(e, "outbound")} />
  </div>
  <div className="col">
    <input type="time" name="time" placeholder="Time" className="form-control" value={formData.outbound.time} onChange={(e) => handleChange(e, "outbound")} />
  </div>
  <div className="col">
    <input type="text" name="airport" placeholder="Airport" className="form-control" value={formData.outbound.airport} onChange={(e) => handleChange(e, "outbound")} />
  </div>
  <div className="col">
    <input type="number" min="0" step="0.01" name="cost" placeholder="Cost" className="form-control" value={formData.outbound.cost} onChange={(e) => handleChange(e, "outbound")} />
  </div>
</div>


<div className="row g-2 mb-2">
  <div className="col">
    <input type="text" name="airline" placeholder="Airline" className="form-control" value={formData.inbound.airline} onChange={(e) => handleChange(e, "inbound")} />
  </div>
  <div className="col">
    <input type="time" name="time" placeholder="Time" className="form-control" value={formData.inbound.time} onChange={(e) => handleChange(e, "inbound")} />
  </div>
  <div className="col">
    <input type="text" name="airport" placeholder="Airport" className="form-control" value={formData.inbound.airport} onChange={(e) => handleChange(e, "inbound")} />
  </div>
  <div className="col">
    <input type="number" min="0" step="0.01" name="cost" placeholder="Cost" className="form-control" value={formData.inbound.cost} onChange={(e) => handleChange(e, "inbound")} />
  </div>
</div>

<div className="row g-2 mb-2">
  <div className="col">
    <input type="text" name="name" placeholder="Hotel Name" className="form-control" value={formData.hotel.name} onChange={(e) => handleChange(e, "hotel")} />
  </div>
  <div className="col">
    <input type="number" min="0" name="nights" placeholder="Nights" className="form-control" value={formData.hotel.nights} onChange={(e) => handleChange(e, "hotel")} />
  </div>
  <div className="col">
    <input type="number" min="0" step="0.01" name="totalCost" placeholder="Total Cost" className="form-control" value={formData.hotel.totalCost} onChange={(e) => handleChange(e, "hotel")} />
  </div>
</div>

          <button className="btn btn-success mt-2" onClick={savePlan}>
            Save
          </button>
        </div>
      )}

      {plans.map((plan) => (
        <div key={plan.id} className="mb-5 p-3 border rounded">
          <h3>{plan.name}</h3>
          <p>
            <strong>From:</strong> {plan.from} | <strong>To:</strong> {plan.to} | <strong>Budget:</strong> {plan.budget}
          </p>
          <p>
            <strong>Outbound Flight:</strong> {plan.outbound.airline} - {plan.outbound.time} - {plan.outbound.airport} - {plan.outbound.cost}
          </p>
          <p>
            <strong>Return Flight:</strong> {plan.inbound.airline} - {plan.inbound.time} - {plan.inbound.airport} - {plan.inbound.cost}
          </p>
          <p>
            <strong>Hotel:</strong> {plan.hotel.name}, {plan.hotel.nights} nights, Total: {plan.hotel.totalCost}
          </p>
          <button className="btn btn-primary btn-sm me-2" onClick={() => toggleAddForm(plan.id)}>Edit</button>
          <button className="btn btn-info btn-sm" onClick={() => handleViewPlan(plan)}>View Details</button>
        </div>
      ))}

      {selectedPlan && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">{selectedPlan.name} Details</h5>
                <button type="button" className="btn-close btn-close-white" onClick={closePopup}></button>
              </div>
              <div className="modal-body">
                <p><strong>From:</strong> {selectedPlan.from}</p>
                <p><strong>To:</strong> {selectedPlan.to}</p>
                <p><strong>Budget:</strong> {selectedPlan.budget}</p>
                <hr />
                <p><strong>Outbound Flight:</strong> {selectedPlan.outbound.airline}, {selectedPlan.outbound.time}, {selectedPlan.outbound.airport}, {selectedPlan.outbound.cost}</p>
                <p><strong>Return Flight:</strong> {selectedPlan.inbound.airline}, {selectedPlan.inbound.time}, {selectedPlan.inbound.airport}, {selectedPlan.inbound.cost}</p>
                <p><strong>Hotel:</strong> {selectedPlan.hotel.name}, {selectedPlan.hotel.nights} nights, Total: {selectedPlan.hotel.totalCost}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closePopup}>Close</button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}

export default PlansDashboard;
