import React, { useState } from "react";


function PlansDashboard() {
  let [plans, setPlans] = useState([
    { id: 1, name: "Plan 1", from: "xxx", to: "yyy", budget: "$1200" },
    { id: 2, name: "Plan 2", from: "aaa", to: "bbb", budget: "$800" },
  ]);

  let [editingPlan, setEditingPlan] = useState(null);
  let [addingNew, setAddingNew] = useState(false);
  let [formData, setFormData] = useState({ name: "", from: "", to: "", budget: "" });


  let [selectedPlan, setSelectedPlan] = useState(null);

  let handleEditClick = (plan) => {
    setAddingNew(false);
    setEditingPlan(plan.id);
    setFormData({ name: plan.name, from: plan.from, to: plan.to, budget: plan.budget });
  };

  let handleSaveClick = (id) => {
    setPlans(plans.map((p) => (p.id === id ? { ...p, ...formData } : p)));
    setEditingPlan(null);
  };

  let handleCancel = () => {
    setEditingPlan(null);
    setAddingNew(false);
    setFormData({ name: "", from: "", to: "", budget: "" });
  };

  let handleDelete = (id) => {
    setPlans(plans.filter((p) => p.id !== id));
  };

  let handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  let handleAddClick = () => {
    setAddingNew(true);
    setEditingPlan(null);
    setFormData({ name: "", from: "", to: "", budget: "" });
  };

  let handleAddSave = () => {
    let newPlan = {
      id: plans.length > 0 ? plans[plans.length - 1].id + 1 : 1,
      ...formData,
    };
    setPlans([...plans, newPlan]);
    setAddingNew(false);
    setFormData({ name: "", from: "", to: "", budget: "" });
  };


  let handleViewPlan = (plan) => {
    setSelectedPlan(plan);
  };

  let closePopup = () => {
    setSelectedPlan(null);
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold text-primary">PLANS</h1>
        <button className="btn btn-primary" onClick={handleAddClick}>
          Add Plan
        </button>
      </div>

      {plans.length > 0 || addingNew ? (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-primary">
              <tr>
                <th>Plan Name</th>
                <th>From</th>
                <th>To</th>
                <th>Budget</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id}>
                  {editingPlan === plan.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="from"
                          className="form-control"
                          value={formData.from}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="to"
                          className="form-control"
                          value={formData.to}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="budget"
                          className="form-control"
                          value={formData.budget}
                          onChange={handleChange}
                        />
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleSaveClick(plan.id)}
                        >
                          Save
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        <button
                          onClick={() => handleViewPlan(plan)}
                          className="btn btn-link p-0 text-decoration-none"
                        >
                          {plan.name}
                        </button>
                      </td>
                      <td>{plan.from}</td>
                      <td>{plan.to}</td>
                      <td>{plan.budget}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => handleEditClick(plan)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(plan.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}


              {addingNew && (
                <tr>
                  <td>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="New plan name"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="from"
                      className="form-control"
                      value={formData.from}
                      onChange={handleChange}
                      placeholder="From"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="to"
                      className="form-control"
                      value={formData.to}
                      onChange={handleChange}
                      placeholder="To"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="budget"
                      className="form-control"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="Budget"
                    />
                  </td>
                  <td className="text-center">
                    <button className="btn btn-success btn-sm me-2" onClick={handleAddSave}>
                      Save
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
                      Cancel
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center mt-5">
          <p className="text-muted">No plans created yet</p>
          <button className="btn btn-link text-primary" onClick={handleAddClick}>
            Create One Now
          </button>
        </div>
      )}

      {selectedPlan && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">{selectedPlan.name} Overview</h5>
                <button type="button" className="btn-close btn-close-white" onClick={closePopup}></button>
              </div>
              <div className="modal-body">
                <p><strong>From:</strong> {selectedPlan.from}</p>
                <p><strong>To:</strong> {selectedPlan.to}</p>
                <p><strong>Budget:</strong> {selectedPlan.budget}</p>
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
