"use client";

import Link from "next/link";
import Image from "next/image";
import ComingBookingCard from "@/app/components/coming-bookings-info";
import { useState, useEffect } from "react";



export default function DashboardPage() {
    const userRole = sessionStorage.getItem("userRole");
    const userName = sessionStorage.getItem("userName");
    const userMail = sessionStorage.getItem("userName");

    const [loading, setLoading] = useState(true);







    useEffect(() => {

        const Loader = document.getElementById("loader")


        if (loading === true) {
            Loader.style.display = "flex"; 
            setTimeout(() => { Loader.style.display = "none"; }, 1500);
            setLoading(false); 
        }

        console.log("user has logged in as a", userRole)
        console.log("user has logged in as ", userName)
        console.log("user has logged in as ", userMail)


        if (userRole === "Underviser") {
            document.getElementById("lokalekontrol").style.display = "none";
            document.getElementById("book-undervisningslokale").style.display = "flex";
            document.getElementById("alle-bookninger").style.display = "flex";
            document.getElementById("book-mødelokale").style.display = "flex";

        }

        if (userRole === "Studerende") {
            document.getElementById("lokalekontrol").style.display = "none";
            document.getElementById("book-undervisningslokale").style.display = "none";
            document.getElementById("alle-bookninger").style.display = "flex";
            document.getElementById("book-mødelokale").style.display = "flex";

        }

    });

    return (
        <div className="dashboard-page-con">
            <div className="dashboard-logo-con" style={{ marginLeft: "200px" }}>
                <Link href="/">
                    <Image
                        src="/timeann-img2.png"
                        alt="TimeAnn logo"
                        width={200}
                        height={20}
                        priority
                    />
                </Link>

                <p>{userRole}</p>

            </div>
            <div className="dashboard-usertitle-con">

                <h1>Velkommen, {userName}</h1>
            </div>

            <div className="dashboard-book-btn-con">

                <div className="dashboard-book-btn" id="book-mødelokale"><Link href="/mødelokale" ><p>Book mødelokale</p></Link></div>
                <div className="dashboard-book-btn" id="book-undervisningslokale"><Link href="/undervisningslokale" ><p>Book undervisningslokale</p></Link></div>
                <div className="dashboard-book-btn" id="alle-bookninger"><Link href="/alle-bookninger" ><p>Se alle bookninger</p></Link></div>
                <div className="dashboard-book-btn" id="lokalekontrol"><Link href="/lokalekontrol" ><p>Lokalekontrol</p></Link></div>


            </div>



            <div className="dashboard-coming-bookings-section">
                <div className="dashboard-coming-bookings-title-con"><h1>Kommende bookninger</h1></div>


                <div className="dashboard-coming-bookings-con">

                    <ComingBookingCard />

                    <div className="loader-con">
                        <div id="loader"></div>
                    </div>



                </div>
            </div>
        </div>
    );
}
