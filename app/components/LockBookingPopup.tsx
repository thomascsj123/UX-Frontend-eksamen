"use client";
import React, { useState } from "react";
import { DatePicker } from "@mantine/dates";

interface LockBookingPopupProps {
  showPopUp: boolean;
  closePopUp: () => void;
  children?: React.ReactNode;
  bookingId?: string | null;
}

function LockBookingPopup({ showPopUp, closePopUp, children, bookingId }: LockBookingPopupProps) {
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);

  async function handleSave() {

    if (!from || !to) return;

    const res = await fetch("/api/locked-bookings", {  
  method: "PATCH",
  body: JSON.stringify({
    id: bookingId,
    starts_at: from.toISOString(),
    ends_at: to.toISOString(),
  }),
  headers: { "Content-Type": "application/json" },
});

    //small example of what is send via a json body to the api route 
    // "id": "c714508c-60fb-4786-9db8-a9cabb3ad331",
  //"starts_at": "2025-12-15 time:00:00:00.000Z",
  //"ends_at": "2025-12-17 time:00:00:00.000Z"

    await res.json();

    setFrom(null);
    setTo(null);
    closePopUp();
    window.location.reload();
  }

  function handleCancel() {
    setFrom(null);
    setTo(null);
    closePopUp();
  }

  if (!showPopUp) return null;

  return (
    <div className="lockbooking-popup">
      <div className="lockbooking-popup-top-con">
        <div className="lockbooking-popup-close-btn" onClick={closePopUp}>X</div>
      </div>

      <div className="lockbooking-popup-main-con">


        <div className="lockbooking-datepicker-wrapper">

          <div className="lockbooking-datepicker-con">
            <div className="lockbooking-datepicker-title">
              <p>Start dato</p>
            </div>
            <DatePicker
              value={from}
              onChange={(value) => setFrom(value ? new Date(value) : null)}
              maxDate={to ?? undefined}

            />
          </div>

          <div className="lockbooking-datepicker-con">
            <div className="lockbooking-datepicker-title">
              <p>Slut dato</p>
            </div>
            <DatePicker
              value={to}
              onChange={(value) => setTo(value ? new Date(value) : null)}
              minDate={from ?? undefined}
            />
          </div>

        </div>

        <div className="edit-lockbooking-btn-con">
          <div className="edit-lockbooking-btn" onClick={handleCancel}><p>Annuller</p></div>
          <div className="edit-lockbooking-btn" onClick={handleSave}><p>Gem ændringer</p></div>
        </div>

      </div>

      {children}
    </div>
  );
}

export default LockBookingPopup;
