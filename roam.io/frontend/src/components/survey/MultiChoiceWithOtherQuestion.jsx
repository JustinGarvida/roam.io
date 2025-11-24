import React from "react";
import Question from "./Question";

/**
 * Props:
 * - label: string
 * - name: string
 * - options: [{ value, label }]
 * - value: string | string[]   (string for single, array for multiple)
 * - onChange: (name, value) => void
 * - multiple: boolean          (false = radio, true = checkboxes)
 * - otherName: string
 * - otherValue: string
 * - required?: boolean
 */
function MultiChoiceWithOtherQuestion({
  label,
  name,
  options,
  value,
  onChange,
  multiple = false,
  otherName,
  otherValue,
  required = false,
}) {
  const isSelected = (optionValue) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  const handleOptionChange = (optionValue) => {
    if (multiple) {
      const current = Array.isArray(value) ? value : [];
      if (current.includes(optionValue)) {
        onChange(
          name,
          current.filter((v) => v !== optionValue)
        );
      } else {
        onChange(name, [...current, optionValue]);
      }
    } else {
      onChange(name, optionValue);
    }
  };

  const handleOtherChange = (e) => {
    onChange(otherName, e.target.value);
  };

  const inputType = multiple ? "checkbox" : "radio";

  return (
    <Question label={label}>
      {options.map((opt, idx) => (
        <div className="form-check" key={opt.value}>
          <input
            className="form-check-input"
            type={inputType}
            name={name}
            id={`${name}-${opt.value}`}
            value={opt.value}
            checked={isSelected(opt.value)}
            onChange={() => handleOptionChange(opt.value)}
            {...(!multiple && idx === 0 && required ? { required: true } : {})}
          />
          <label className="form-check-label" htmlFor={`${name}-${opt.value}`}>
            {opt.label}
          </label>
        </div>
      ))}
      <div className="form-check d-flex align-items-center mt-1">
        {!multiple && (
          <input
            className="form-check-input me-2"
            type="radio"
            name={name}
            id={`${name}-other`}
            value="other"
            checked={value === "other"}
            onChange={() => handleOptionChange("other")}
          />
        )}
        <label
          className="form-check-label me-2"
          htmlFor={!multiple ? `${name}-other` : undefined}
        >
          Other:
        </label>
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: "250px" }}
          name={otherName}
          value={otherValue}
          onChange={handleOtherChange}
          placeholder="Type here"
        />
      </div>
    </Question>
  );
}

export default MultiChoiceWithOtherQuestion;
