import React, { useRef } from "react";
import Question from "./Question";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DateQuestion({
  label,
  startName,
  endName,
  startValue,
  endValue,
  onChange,
}) {
  const datePickerRef = useRef(null);

  const handleChange = (dates) => {
    const [start, end] = dates;
    onChange(startName, start);
    onChange(endName, end);
  };

  const openCalendar = () => {
    datePickerRef.current.setOpen(true);
  };

  return (
    <Question label={label}>
      <div className="mb-4">
        <label className="form-label fw-semibold mb-2">Start Date</label>
        <input
          type="text"
          className="form-control"
          value={startValue ? startValue.toISOString().slice(0, 10) : ""}
          onClick={openCalendar}
          readOnly
          placeholder="YYYY-MM-DD"
        />
      </div>

      <div className="mb-4">
        <label className="form-label fw-semibold mb-2">End Date</label>
        <input
          type="text"
          className="form-control"
          value={endValue ? endValue.toISOString().slice(0, 10) : ""}
          onClick={openCalendar}
          readOnly
          placeholder="YYYY-MM-DD"
        />
      </div>

      <ReactDatePicker
        ref={datePickerRef}
        selectsRange
        startDate={startValue}
        endDate={endValue}
        onChange={handleChange}
        inline
        minDate={new Date()}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
      />
    </Question>
  );
}

export default DateQuestion;
