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
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);
  const [selectedBookingInfo, setSelectedBookingInfo] = useState(null);

  // Hent brugerens mail
  const userMail =
    typeof window !== "undefined" ? sessionStorage.getItem("userMail") : null;

  // Hent bookinger for den aktuelle bruger (baseret på participants)
  useEffect(() => {
    const fetchBookings = async () => {
      if (!userMail) return;

      const { data, error } = await supabase
        .from("session-table")
        .select("id, room_id, created_at, ends_at, participants")
        .ilike("participants", `%${userMail}%`); // 👈 VIGTIG ÆNDRING

      if (error) {
        console.error("Error fetching bookings:", error);
        return;
      }

      setBookedDates(data);
    };

    fetchBookings();
  }, [userMail]);

  // Klik på kalenderdag
  const handleSelect = (date) => {
    const isSelected = selected.some((s) => dayjs(date).isSame(s, "date"));

    if (isSelected) {
      setSelected([]);
      setSelectedBookingInfo(null);
    } else {
      setSelected([date]);

      const found = bookedDates.find((b) =>
        dayjs(b.created_at).isSame(date, "date")
      );

      setSelectedBookingInfo(found || null);
    }
  };

  // Håndter sletning
  const handleDelete = async () => {
    if (!selectedBookingInfo) return;

    try {
      await supabase.from("session-table").delete().eq("id", selectedBookingInfo.id);

      setBookedDates((prev) =>
        prev.filter((b) => b.id !== selectedBookingInfo.id)
      );

      setSelected([]);
      setSelectedBookingInfo(null);
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
            <input
              className="abinput"
              type="text"
              value={
                selectedBookingInfo
                  ? dayjs(selectedBookingInfo.created_at).format("YYYY-MM-DD")
                  : ""
              }
              readOnly
            />

            <p className="inputtext">Lokale</p>
            <input
              className="abinput"
              type="text"
              value={selectedBookingInfo?.room_id || ""}
              readOnly
            />

            <p className="inputtext">Tidsrum</p>
            <input
              className="abinput"
              type="text"
              value={
                selectedBookingInfo
                  ? `${dayjs(selectedBookingInfo.created_at).format(
                      "HH:mm"
                    )} - ${dayjs(selectedBookingInfo.ends_at).format("HH:mm")}`
                  : ""
              }
              readOnly
            />

            <p className="inputtext">Deltagere</p>
            <input
              className="abinput"
              type="text"
              value={selectedBookingInfo?.participants || ""}
              readOnly
            />
          </div>

          <div className="sletknapdiv">
            <button
              className="sletknap"
              disabled={!selectedBookingInfo}
              onClick={() => setShowConfirm(true)}
            >
              Slet booking
            </button>
          </div>
        </div>

        <div className="kalender">
          <div className="abkalender">
            <Calendar
              getDayProps={(date) => {
                const isSelected = selected.some((s) =>
                  dayjs(date).isSame(s, "date")
                );

                const isBooked = bookedDates.some((b) =>
                  dayjs(date).isSame(b.created_at, "date")
                );

                return {
                  selected: isSelected,
                  style: {
                    backgroundColor: isBooked ? "#ffdf80" : undefined,
                    borderRadius: isBooked ? "8px" : undefined,
                  },
                  onClick: () => handleSelect(date),
                };
              }}
            />
          </div>
        </div>
      </div>

      {/* Popup */}
      {showConfirm && selectedBookingInfo && (
        <div className="popup-overlay">
          <div className="popup-modal">
            <p>
              Bekræft sletning af lokale {selectedBookingInfo.room_id} d.{" "}
              {dayjs(selectedBookingInfo.created_at).format("DD/MM")} fra{" "}
              {dayjs(selectedBookingInfo.created_at).format("HH:mm")} –
              {dayjs(selectedBookingInfo.ends_at).format("HH:mm")}
            </p>

            <div className="popup-buttons">
              <button onClick={() => setShowConfirm(false)} className="btn-cancel">
                Annuller
              </button>
              <button onClick={handleDelete} className="btn-delete">
                Bekræft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
