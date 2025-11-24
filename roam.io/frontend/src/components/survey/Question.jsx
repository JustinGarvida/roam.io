import React from "react";

function Question({ label, children }) {
  return (
    <div className="mb-3">
      {label && <label className="form-label fw-bold">{label}</label>}
      {children}
    </div>
  );
}

export default Question;
