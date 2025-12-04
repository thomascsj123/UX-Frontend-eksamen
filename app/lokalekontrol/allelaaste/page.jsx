"use client"

import LockedBookingCard from '../../components/LockedBookings';
import './lockedroom.css';
import Link from "next/link";
import { useState, useEffect } from "react";


//toggles between the state of the popup for editting the lcoked room


export default function Lockedroom() {

const [loading, setLoading] = useState(true);


    useEffect(() => {

        const Loader = document.getElementById("loader")


        if (loading === true) {
            Loader.style.display = "flex"; 
            setTimeout(() => { Loader.style.display = "none"; }, 1000);
            setLoading(false); 
        }

    
    });

    return (
        <div>
            <div className="abtop">
                <Link href="/"> <img className="ablogo" src="/timeann-img.png" alt="" /> </Link>

                <p className="abtext">
                    <Link href="/dashboard-page">Dashboard / </Link> <Link href="/lokalekontrol">lokalekontrol / </Link><span className="abp"><Link href="/lokalekontrol/allelaaste">Alle låste lokaler</Link></span>
                </p>
            </div>

            <div className="overskrift">
                <p className="aboverskrift">Alle låste lokaler</p>
            </div>

            <div className='lockedroomdiv'>


                <LockedBookingCard />


                <div className="loader-con">
                    <div id="loader"></div>
                </div>

            </div>



        </div>
    );
}