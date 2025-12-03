"use client"

import './lokalekontrol.css';
import { useRouter } from "next/navigation"
import Link from "next/link";

export default function Lokalekontrol () {

    const router = useRouter();




    return(
        <div>
            <div className="abtop">
        <Link href="/dashboard-page"><img className="ablogo" src="/timeann-img.png" alt="" /></Link>
        <p className="abtext">
          <Link href="/dashboard-page" className="hover:underline"> Dashboard </Link> / <span className="abp">Lokalekontrol</span>
        </p>
      </div>

      <div className="overskrift">
        <p className="aboverskrift">Lokalekontrol</p>
      </div>

        <div className='klikboksdiv'>

            <button className='lokale' onClick={() => router.push("/lokalekontrol/laaslokale")}>Lås lokale</button>
            <button className='lokale' onClick={() => router.push("/lokalekontrol/laaslokale")}>Alle låste lokaler</button>

        </div>



        </div>
    );
}