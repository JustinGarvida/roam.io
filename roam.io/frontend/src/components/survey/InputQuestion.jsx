import React from "react";
import Question from "./Question";

function InputQuestion({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  as = "input",
  ...rest
}) {
  const handleChange = (e) => {
    onChange(name, e.target.value);
  };

  return (
    <Question label={label}>
      {as === "textarea" ? (
        <textarea
          name={name}
          className="form-control"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          {...rest}
        />
      ) : (
        <input
          type={type}
          name={name}
          className="form-control"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          {...rest}
        />
      )}
    </Question>
  );
}

export default InputQuestion;
