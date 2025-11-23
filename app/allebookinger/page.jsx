"use client"

import Link from "next/link";
import Image from "next/image";
import "./allebookinger.css";
import { TextInput } from '@mantine/core';
import { Calendar } from '@mantine/dates';

export default function Bookinger () {
    return(
        <div>
            <div className="abtop">
                <img className="ablogo" src="/timeann-img.png" alt="" />

                <p className="abtext">Dashboard / <span className="abp">Alle bookinger</span></p>
            </div>

            <div className="overskrift">
                <p className="aboverskrift">Alle bookinger</p>
            </div>

            <div className="abmain">

                <div className="knapdiv">

                <div className="dato">
                    <p className="inputtext">Dato</p>
                    <input className="abinput" type="date" />

                    <p className="inputtext">Lokale</p>
                    <input className="abinput" type="text" />

                    <p className="inputtext">Tidsrum</p>
                    <input className="abinput" type="time" />

                    <p className="inputtext">Deltagere</p>
                    <input className="abinput" type="text" />

                        

                </div>
                    <div className="sletknapdiv">
                        <button className="sletknap">Slet booking</button>
                    </div>
                </div>

            <div className="kalender">
                <div className="abkalender">
                <Calendar
                    size="md"                 
                    withCellSpacing           
                    weekendDays={[0, 6]}      
                    highlightToday={true}
                    getDayProps={(date) => {
                 const d = new Date(date);

                return {
                    style: {
                    color: d.getDay() === 0 ? "red" : undefined,
                     },
                    };
}}
    />
    </div>
            </div>

                

            </div>


                

        </div>
    );
}