"use client"

import { useState, useEffect } from "react";
import LockBookingPopup from './LockBookingPopup';



export default function LockedBookingCard() {

    const [showPopUp, setShowPopUp] = useState(false)
    const [lockedbookings, setLockedBookings] = useState([]);
    const [lockedbookingsid, setLockedBookingsId] = useState(null)


    //fetches the locked bookings from the api route under locked-bookings 
    useEffect(() => {

        fetch(`/api/locked-bookings`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setLockedBookings(data);
            })
            .catch(err => console.error("Fetch error:", err));

    }, []);



    return (
        <>
            {/*should take the entire returned bookings array with all bookings  */}
            {/*after it should only take the values between index 0 and 4 = 3 values and give them to the component */}
            {lockedbookings.slice(0, 3).map((lockedbooking) => {



                //used to isolate the weekdays and months by themsleves from the created_at value
                const beginDate = new Date(lockedbooking.starts_at);
                const endDate = new Date(lockedbooking.ends_at);


                //finds the exact date from the start and ends at dates from the database
                const Begin_date = beginDate.toLocaleDateString("da-DK");
                const End_date = endDate.toLocaleDateString("da-DK");


                return (

                    <div key={lockedbooking.locked_session_id}>

                        <div className="locked-booking-con">



                            <div className="locked-booking-background">

                                <div className="locked-booking-title-con">
                                    <p>{lockedbooking.room_id}</p>
                                </div>

                                <div className="locked-booking-btn-con">

                                    <div className="locked-booking-btn" onClick={() => {
                                        setLockedBookingsId(lockedbooking.locked_session_id);
                                        setShowPopUp(true);
                                    }}><p>Administrer lokale</p></div>

                                </div>

                            </div>


                            <div className="locked-booking-info-con">
                                <div className="locked-booking-start">
                                    <p>START: D {Begin_date}</p>
                                </div>
                                <div className="locked-booking-end">
                                    <p>SLUT: D {End_date}</p>
                                </div>

                            </div>
                        </div>

                        <LockBookingPopup showPopUp={showPopUp} closePopUp={() => {
                            setShowPopUp(false);
                            setLockedBookingsId(null);
                            //passes the bookingid as the selected locked room about to be edited 
                            //gets passsed to the lockingsPopUp to send via request body
                        }} bookingId={lockedbookingsid}>

                        </LockBookingPopup>
                    </div>
                );
            })}
        </>


    )

}

