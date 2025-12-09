import React, { useState, useEffect, useCallback } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { supabase } from "../services/auth";
import { useNavigate } from "react-router-dom";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function CalendarPage() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      let { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("user_id", user.id);

      if (error || !data) return;

      setEvents(transformPlansToEvents(data));
    }
    loadData();
  }, []);

  const transformPlansToEvents = (plans) => {
    let calendarEvents = [];

    const safeDate = (d, t) => {
      if (!d || !t) return null;
      const dateObj = new Date(`${d}T${t}`);
      return isNaN(dateObj.getTime()) ? null : dateObj;
    };

    plans.forEach((plan) => {
      if (!plan) return;

      const outboundStart = safeDate(plan.outbound?.date, plan.outbound?.time);
      if (outboundStart) {
        calendarEvents.push({
          id: `out-${plan.id}`,
          title: `Fly to ${plan.to}`,
          start: outboundStart,
          end: outboundStart,
          allDay: false,
          resource: plan,
          type: "flight-out",
        });
      }

      const inboundStart = safeDate(plan.inbound?.date, plan.inbound?.time);
      if (inboundStart) {
        calendarEvents.push({
          id: `in-${plan.id}`,
          title: `Return from ${plan.to}`,
          start: inboundStart,
          end: inboundStart,
          allDay: false,
          resource: plan,
          type: "flight-in",
        });
      }

      if (plan.outbound?.date && plan.hotel?.nights > 0) {
        const hotelStart = new Date(plan.outbound.date);
        const hotelEnd = new Date(plan.outbound.date);

        hotelStart.setDate(hotelStart.getDate() + 1);
        hotelEnd.setDate(hotelStart.getDate() + parseInt(plan.hotel.nights) - 1);

        calendarEvents.push({
          id: `hotel-${plan.id}`,
          title: `Hotel: ${plan.hotel.name}`,
          start: hotelStart,
          end: hotelEnd,
          allDay: true,
          resource: plan,
          type: "hotel",
        });
      }
    });

    return calendarEvents;
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = "#0d6efd"; // default blue
    if (event.type === "flight-in") backgroundColor = "#dc3545"; // red
    if (event.type === "hotel") backgroundColor = "#198754"; // green

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.9,
        color: "white",
        border: 0,
        display: "block",
      },
    };
  };

  const onNavigate = useCallback((newDate) => setDate(newDate), []);
  const onView = useCallback((newView) => setView(newView), []);

  return (
    <div className="container py-5">
      {/* HEADER ROW */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Travel Calendar</h1>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/plans")}
        >
          My Plans
        </button>
      </div>

      {/* CALENDAR */}
      <div
        className="rbc-wrapper bg-white p-3 border rounded shadow-sm"
        style={{ height: "600px" }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          date={date}
          view={view}
          onNavigate={onNavigate}
          onView={onView}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 520 }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) => setSelectedEvent(event.resource)}
        />
      </div>

      {/* EVENT MODAL */}
      {selectedEvent && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1055 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">{selectedEvent.name}</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedEvent(null)}
                ></button>
              </div>

              <div className="modal-body">
                <p><strong>Destination:</strong> {selectedEvent.to}</p>
                <p><strong>Budget:</strong> {selectedEvent.budget}</p>

                <hr />

                <h6 className="text-primary">Outbound</h6>
                <p>
                  {selectedEvent.outbound?.date} @ {selectedEvent.outbound?.time} (
                  {selectedEvent.outbound?.airline})
                </p>

                {selectedEvent.inbound?.date && (
                  <>
                    <h6 className="text-danger mt-3">Inbound</h6>
                    <p>
                      {selectedEvent.inbound?.date} @ {selectedEvent.inbound?.time} (
                      {selectedEvent.inbound?.airline})
                    </p>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => setSelectedEvent(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM STYLING FOR RBC BUTTONS */}
      <style>
        {`
          .rbc-toolbar button {
            color: #495057;
            background-color: #fff;
            border: 1px solid #ced4da;
            padding: .375rem .75rem;
            border-radius: .25rem;
          }

          .rbc-toolbar button:hover {
            background-color: #e9ecef;
          }

          .rbc-toolbar button.rbc-active {
            color: #fff !important;
            background-color: #0d6efd !important;
            border-color: #0d6efd !important;
          }
        `}
      </style>
    </div>
  );
}

export default CalendarPage;
