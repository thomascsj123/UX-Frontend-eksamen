
import Link from "next/link";
import Image from "next/image";
import ComingBookingCard from "@/app/components/coming-bookings-info";


export default function DashboardPage() {
    return (
        <div className="dashboard-page-con">
            <div className="dashboard-logo-con" style={{ marginLeft: "200px" }}>
                <Link href="/">
                <Image
                    src="/timeann-img.png"
                    alt="TimeAnn logo"
                    width={200}
                    height={20}
                    priority
                />
                </Link>
                
            </div>
            <div className="dashboard-usertitle-con">

                <h1>Velkommen "bruger"</h1>
            </div>

            <div className="dashboard-book-btn-con">

                <div className="dashboard-book-btn"><p>Book mødelokale</p></div>
                <div className="dashboard-book-btn"><p>Book undervisningslokale</p></div>
                <div className="dashboard-book-btn"><p>Alle bookninger</p></div>
                <div className="dashboard-book-btn"><p>Lokalekontrol</p></div>


            </div>



            <div className="dashboard-coming-bookings-section">
                <div className="dashboard-coming-bookings-title-con"><h1>Kommende bookninger</h1></div>


                <div className="dashboard-coming-bookings-con">

                    <ComingBookingCard
                        date="Tirsdag 25/11-2025"
                        room_id="CL3-CL11"
                        booked_time="08:00-10:30 UTC"
                        participants="23"
                    />

                    <ComingBookingCard
                        date="Tirsdag 25/11-2025"
                        room_id="CL3-CL11"
                        booked_time="08:00-10:30 UTC"
                        participants="23"
                    />

                    <ComingBookingCard
                        date="Tirsdag 25/11-2025"
                        room_id="CL3-CL11"
                        booked_time="08:00-10:30 UTC"
                        participants="23"
                    />








                </div>
            </div>
        </div>
    );
}
