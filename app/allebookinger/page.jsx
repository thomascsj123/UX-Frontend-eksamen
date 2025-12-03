"use client";

import Link from "next/link";
import Image from "next/image";
import "./allebookinger.css";
import { Calendar } from "@mantine/dates";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { supabase } from "@/app/supabaseClient";

export default function Bookinger() {
  const [selected, setSelected] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false); // Popup state

  // Hent bookinger fra Supabase
  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from('session-table')
        .select("created_at");

      if (error) {
        console.error("Error fetching bookings:", error);
        return;
      }

      const bookedDates = data.map((b) => new Date(b.created_at));
      setSelected(bookedDates);
    };

    fetchBookings();
  }, []);

  // Klik på kalenderdag
  const handleSelect = (date) => {
    const isSelected = selected.some((s) => dayjs(date).isSame(s, "date"));

    if (isSelected) {
      setSelected((current) =>
        current.filter((d) => !dayjs(d).isSame(date, "date"))
      );
    } else {
      setSelected((current) => [...current, date]);
    }
  };

  // Håndter sletning
  const handleDelete = async () => {
    try {
      const dateToDelete = selected[0]; // Slet første valgte (tilpas som du vil)
      await supabase
        .from("session-table")
        .delete()
        .eq("created_at", dateToDelete.toISOString());

      setSelected((current) =>
        current.filter((d) => !dayjs(d).isSame(dateToDelete, "date"))
      );

      setShowConfirm(false);
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <div>
      <div className="abtop">
        <img className="ablogo" src="/timeann-img.png" alt="" />
        <p className="abtext">
          Dashboard / <span className="abp">Alle bookinger</span>
        </p>
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
            <button
              className="sletknap"
              onClick={() => setShowConfirm(true)}
            >
              Slet booking
            </button>
          </div>
        </div>

        <div className="kalender">
          <div className="abkalender">
            <Calendar
              getDayProps={(date) => ({
                selected: selected.some((s) => dayjs(date).isSame(s, "date")),
                onClick: () => handleSelect(date),
              })}
            />
          </div>
        </div>
      </div>

      {/* Popup */}
      {showConfirm && (
        <div className="popup-overlay">
          <div className="popup-modal">
            <p>Bekræft venligst sletning af booking af lokale 3.9, Mandag d. 10/12 fra kl. 08:00-09:15</p>
            <div className="popup-buttons">
              <button
                onClick={() => setShowConfirm(false)}
                className="btn-cancel"
              >
                Annuller
              </button>
              <button
                onClick={handleDelete}
                className="btn-delete"
              >
                Bekræft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
