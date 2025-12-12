"use client"

import { useState, useEffect } from "react";

export default function ComingBookingCard({onBookingStatus}) {
  const [bookings, setBookings] = useState([]);
  const [bookingstatus, setBookingStatus] = useState("")

  useEffect(() => {

    const userMail = sessionStorage.getItem("userMail");

    fetch(`/api/coming-bookings?email=${encodeURIComponent(userMail)}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Fetched bookings:", data);
        setBookings(data);

        if (data.length < 1) {
          console.log("hej")
          setBookingStatus("Der er ingen bookinger prøv igen senere")


          if (onBookingStatus) onBookingStatus("Der er ingen bookinger prøv igen senere");
        }

      })
      .catch(err => console.error("Fetch error:", err));



  }, []);



  return (
    <>
      {bookings.slice(0, 3).map((booking) => {

        // bruger starts_at i stedet for created_at
        const beginDate = new Date(booking.starts_at);
        const endDate = new Date(booking.ends_at);

        const weekday = beginDate.toLocaleDateString("da-DK", { weekday: "long" });

        const monthdate = beginDate.toLocaleDateString("da-DK", {
          month: "long",
          day: "numeric"
        });

        const startTime = beginDate.toLocaleTimeString("da-DK", {
          hour: "2-digit",
          minute: "2-digit"
        });

        const endTime = endDate.toLocaleTimeString("da-DK", {
          hour: "2-digit",
          minute: "2-digit"
        });

        return (
          <div key={booking.id}>
            <div className="dashboard-coming-bookings-btn-con">
              <div className="dashboard-coming-bookings-title">
                <h2 id="coming-booking-date-title">{weekday} {monthdate}</h2>
              </div>

              <div className="dashboard-coming-bookings-btn-textcon">
                <p>Lokale: {booking.room_id}</p>
                <p>Tidsrum: {startTime} - {endTime}</p>
                <p>Deltager antal: {booking.participation_}</p>
              </div>

              <div className="coming-bookings-bluebtn-con">
                {/* tom container */}
              </div>

            </div>
          </div>
        );
      })}
    </>
  );
}
