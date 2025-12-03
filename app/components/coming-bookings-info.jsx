"use client"

import { useState, useEffect } from "react";


export default function ComingBookingCard() {
  const [bookings, setBookings] = useState([]);



  //fetches the coming bookings from the api route
  useEffect(() => {

     const userMail = sessionStorage.getItem("userMail");
    
    // Add email as query parameter
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
      })
      .catch(err => console.error("Fetch error:", err));

  }, []);



  return (
    <>
    {/*should take the entire returned bookings array with all bookings  */}
    {/*after it should only take the values between index 0 and 4 = 3 values and give them to the component */}
      {bookings.slice(0, 3).map((booking) => {

        //{bookings.slice(0, 4).map((booking) => (    ))}

        //used to isolate the weekdays and months by themsleves from the created_at value
        const beginDate = new Date(booking.created_at);
        const endDate = new Date(booking.ends_at);

        //finds the weekday from the created_at value
        const weekday = beginDate.toLocaleDateString("da-DK", { weekday: "long" });

        //finds the month from the created_at value
        const monthdate = beginDate.toLocaleDateString("da-DK", { month: "long", day: "numeric" })

        const startTime = beginDate.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })
        //isolate the time from the created_at variable

        const endTime = beginDate.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })
          
        return (
          <div key={booking.id}>
            <div className="dashboard-coming-bookings-btn-con">
              <div className="dashboard-coming-bookings-title">
                <h2 id="coming-booking-date-title">{weekday} {monthdate}</h2>
              </div>

              <div className="dashboard-coming-bookings-btn-textcon">
                <p>Lokale: {booking.room_id}</p>
                <p>Tidsrum: {startTime}-{endTime}</p>
                <p>Deltager antal: {booking.participation_}</p>
              </div>

              <div className="coming-bookings-bluebtn-con">
                
              </div>

            </div>
          </div>
        );
      })}
    </>


  )

}

