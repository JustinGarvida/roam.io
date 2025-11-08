import React, { useState } from "react";

function PlansDashboard() {
  const [plans, setPlans] = useState([
    { id: 1, name: "Plan 1", from: "xxx", to: "yyy", budget: "$1200" },
    { id: 2, name: "Plan 2", from: "aaa", to: "bbb", budget: "$800" },
  ]);

  const [editingPlan, setEditingPlan] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [formData, setFormData] = useState({ name: "", from: "", to: "", budget: "" });

  const handleEditClick = (plan) => {
    setAddingNew(false);
    setEditingPlan(plan.id);
    setFormData({ name: plan.name, from: plan.from, to: plan.to, budget: plan.budget });
  };

  const handleSaveClick = (id) => {
    setPlans(plans.map((p) => (p.id === id ? { ...p, ...formData } : p)));
    setEditingPlan(null);
  };

  const handleCancel = () => {
    setEditingPlan(null);
    setAddingNew(false);
    setFormData({ name: "", from: "", to: "", budget: "" });
  };

  const handleDelete = (id) => {
    setPlans(plans.filter((p) => p.id !== id));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddClick = () => {
    setAddingNew(true);
    setEditingPlan(null);
    setFormData({ name: "", from: "", to: "", budget: "" });
  };

  const handleAddSave = () => {
    const newPlan = {
      id: plans.length > 0 ? plans[plans.length - 1].id + 1 : 1,
      ...formData,
    };
    setPlans([...plans, newPlan]);
    setAddingNew(false);
    setFormData({ name: "", from: "", to: "", budget: "" });
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold text-primary">PLANS</h1>
        <button className="btn btn-primary" onClick={handleAddClick}>
          Add Plan
        </button>
      </div>

      {/* Table */}
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
                      <td>{plan.name}</td>
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

              {/* New Plan Row */}
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
    </div>
  );
}

export default PlansDashboard;
