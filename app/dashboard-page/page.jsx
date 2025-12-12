"use client";

import Link from "next/link";
import Image from "next/image";
import ComingBookingCard from "@/app/components/coming-bookings-info";
import { useState, useEffect } from "react";

export default function DashboardPage() {
    const [userRole, setUserRole] = useState("");
    const [userName, setUserName] = useState("");
    const [userMail, setUserMail] = useState("");
    const [loading, setLoading] = useState(true);
    const [bookingstatus, setBookingStatus] = useState("");

    useEffect(() => {
        // Dette kører kun i browseren
        const role = sessionStorage.getItem("userRole") || "";
        const name = sessionStorage.getItem("userName") || "";
        const mail = sessionStorage.getItem("userMail") || "";

        setUserRole(role);
        setUserName(name);
        setUserMail(mail);

        const Loader = document.getElementById("loader");
        if (loading && Loader) {
            Loader.style.display = "flex";
            setTimeout(() => { Loader.style.display = "none"; }, 1500);
            setLoading(false);

        }


        console.log("user has logged in as a", role);
        console.log("user has logged in as ", name);
        console.log("user has logged in as ", mail);

        // Vis/skjul elementer baseret på rolle
        if (role === "Underviser") {
            document.getElementById("lokalekontrol").style.display = "none";
            document.getElementById("book-undervisningslokale").style.display = "flex";
            document.getElementById("alle-bookninger").style.display = "flex";
            document.getElementById("book-mødelokale").style.display = "flex";
        }

        if (role === "Studerende") {
            document.getElementById("lokalekontrol").style.display = "none";
            document.getElementById("book-undervisningslokale").style.display = "none";
            document.getElementById("alle-bookninger").style.display = "flex";
            document.getElementById("book-mødelokale").style.display = "flex";
        }
    }, [loading]);

    return (
        <div className="dashboard-page-con">
            <div className="dashboard-logo-con" style={{ marginLeft: "200px" }}>
                <div className="dashboard-logo">
                    <Link href="/">
                        <Image
                            src="/timeann-img2.png"
                            alt="TimeAnn logo"
                            width={200}
                            height={20}
                            priority
                        />
                    </Link>

                </div>

                <div className="dashboard-user-con">
                    <p>{userRole}</p>
                    <Link href="/"> <p id="user-logout">Log ud</p> </Link>

                </div>

            </div>



            <div className="dashboard-usertitle-con">
                <h1>Velkommen, {userName}</h1>
            </div>

            <div className="dashboard-book-btn-con">
                <div className="dashboard-book-btn" id="book-mødelokale" onClick={() => (window.location.href = "/pages/moedelokale")}><p>Book mødelokale</p></div>
                <div className="dashboard-book-btn" id="book-undervisningslokale" onClick={() => (window.location.href = "/pages")}><p>Book undervisningslokale</p></div>
                <div className="dashboard-book-btn" id="alle-bookninger" onClick={() => (window.location.href = "/allebookinger")}><p>Se alle bookninger</p></div>
                <div className="dashboard-book-btn" id="lokalekontrol" onClick={() => (window.location.href = "/lokalekontrol")}><p>Lokalekontrol</p></div>
            </div>

            <div className="dashboard-coming-bookings-section">
                <div className="dashboard-coming-bookings-title-con"><h1>Kommende bookninger</h1></div>
                <div className="dashboard-coming-bookings-con">

                    {/*only runs when the opposite of loading is true - and when the bookingstatus has a string value not ""  */}
                    {/*logical operator - if the condition is true - return content - if not nothing gets returneed */}
                    {!loading && bookingstatus &&(
                        <p id="booking-status">{bookingstatus}</p>
                    )}

                    {/*onBookingStatus is the prop the component receives 
                     the setBookingStatus is value being passed to the prop*/}

                    {/*when the state in the component changes call the function */}
                    <ComingBookingCard onBookingStatus={setBookingStatus} />
                    <div className="loader-con">
                        <div id="loader"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
