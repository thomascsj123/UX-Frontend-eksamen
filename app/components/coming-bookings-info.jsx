"use client"
import { GetBookings } from "@/app/api/coming-bookings";


export default function ComingBookingCard({
date,
participants,
booked_time,
room_id,


}) {
    return (

        <div className="dashboard-coming-bookings-btn-con">
            <div className="dashboard-coming-bookings-title"><h2>{date}</h2></div>

            <div className="dashboard-coming-bookings-btn-textcon">

                <p>Lokale: {room_id}</p>
                <p>Tidsrum {booked_time}</p>
                <p>Deltager antal: {participants}</p>

            </div>

            <div className="dashboard-coming-bookings-btn" onClick={GetBookings}><h2>Se booking</h2></div>


        </div>
    )

}

  