"use client";

import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { Calendar } from "@mantine/dates";
import BlueButton from "../../components/BlueButton.jsx";
import BlueButtonSmall from "../../components/BlueButtonSmall.jsx";
import "../../lokalekontrol/lokalekontrol.css";
import { createClient } from "@supabase/supabase-js";
import Modal from "../../components/Popup.jsx";

export default function Laaslokale() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const [conflictingBookings, setConflictingBookings] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [confirmPopupOpen, setConfirmPopupOpen] = useState(false);
  const [successPopupOpen, setSuccessPopupOpen] = useState(false);

  const [selected, setSelected] = useState([]);
  const [activeTab, setActiveTab] = useState(3);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedBookingInfo, setSelectedBookingInfo] = useState(null);

  const rooms = {
    1: ["1.10", "1.11", "1.13", "1.14", "1.15", "1.16"],
    2: ["2.1", "2.11", "2.13", "2.14", "2.15", "2.16"],
    3: ["3.1", "3.11", "3.13", "3.14", "3.15", "3.16"],
    4: ["4.1", "4.11", "4.13", "4.14", "4.15", "4.16"],
  };

  const handleSelect = (date) => {
    const isSelected = selected.some((s) => dayjs(date).isSame(s, "date"));
    if (isSelected) {
      setSelected((current) => current.filter((d) => !dayjs(d).isSame(date, "date")));
    } else {
      setSelected((current) => [...current, date]);
    }
  };

  useEffect(() => {
    const fetchDates = async () => {
      if (selectedRooms.length === 0) {
        setBookedDates([]);
        return;
      }
      const { data } = await supabase
        .from("session-table")
        .select("id, room_id, created_at, ends_at, participants")
        .in("room_id", selectedRooms);

      if (data) setBookedDates(data);
    };
    fetchDates();
  }, [selectedRooms]);

  const handleLockClick = () => {
    const conflicts = bookedDates.filter((booking) =>
      selected.some((selDate) => dayjs(booking.created_at).isSame(selDate, "date"))
    );

    if (conflicts.length > 0) {
      setConflictingBookings(conflicts);
      setPopupOpen(true);
    }
  };

  const handleContinue = () => {
    if (!selectedBookingId) return;
    const booking = conflictingBookings.find((b) => b.id === selectedBookingId);
    setSelectedBookingInfo(booking);
    setPopupOpen(false);
    setConfirmPopupOpen(true);
  };

  const handleDeleteBooking = async () => {
    if (!selectedBookingId) return;

    await supabase.from("session-table").delete().eq("id", selectedBookingId);

    setConfirmPopupOpen(false);
    setSuccessPopupOpen(true);
  };

  return (
    <div className="eksisterendebookinger">
      {/* Popup 1: Vis eksisterende bookinger */}
      <Modal open={popupOpen} onClose={() => setPopupOpen(false)}>
        <h3>Eksisterende bookinger</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {conflictingBookings.map((b) => (
            <div
              key={b.id}
              style={{
                marginBottom: "12px",
                backgroundColor: "#95A6B7",
                padding: "15px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                borderRadius: "10px",
              }}
            >
              <input
                type="checkbox"
                checked={selectedBookingId === b.id}
                onChange={() => setSelectedBookingId(b.id)}
              />
              <p><strong>Lokale:</strong> {b.room_id}</p>
              <p><strong>Start:</strong> {dayjs(b.created_at).format("DD/MM/YYYY HH:mm")}</p>
              <p><strong>Slut:</strong> {dayjs(b.ends_at).format("DD/MM/YYYY HH:mm")}</p>
            </div>
          ))}
        </div>

        <div className="bluebuttonpopupdiv">
          <BlueButtonSmall label="Fortsæt" onClick={handleContinue} />
          <BlueButtonSmall label="Annuller" onClick={() => setPopupOpen(false)} />
        </div>
      </Modal>

      {/* Popup 2: Bekræft sletning */}
      <Modal open={confirmPopupOpen} onClose={() => setConfirmPopupOpen(false)}>
        {selectedBookingInfo && (
          <>
            <p>
              Bekræft venligst låsning af {selectedBookingInfo.room_id} fra
              <br />
              {dayjs(selectedBookingInfo.created_at).format("DD/MM/YYYY HH:mm")} til
              <br />
              {dayjs(selectedBookingInfo.ends_at).format("DD/MM/YYYY HH:mm")}.
            </p>
            <div className="bluebuttonpopupdiv">
              <BlueButtonSmall label="Bekræft" onClick={handleDeleteBooking} />
              <BlueButtonSmall label="Annuller" onClick={() => setConfirmPopupOpen(false)} />
            </div>
          </>
        )}
      </Modal>

      {/* Popup 3: Succes */}
      <Modal open={successPopupOpen} onClose={() => setSuccessPopupOpen(false)}>
        <h3>Lokalet er nu blevet låst!</h3>
        <BlueButtonSmall label="Se alle låste lokaler" onClick={() => window.location.href = "/laaste-lokaler"} />
      </Modal>

      {/* Resten af UI */}
      <div className="abtop">
        <img className="ablogo" src="/timeann-img.png" alt="" />
        <p className="abtext">Dashboard / Lokalekontrol / <span className="abp">Lås lokale</span></p>
      </div>

      <div className="overskrift2">
        <p className="aboverskrift">Lås lokale</p>
      </div>

      <div className="maincontent">
        <div className="vaalglokalediv">
          <p style={{ fontWeight: "bold" }}>Vælg lokale<span style={{ color: "red" }}>*</span></p>
          <br />

          <div className="boxtab">
            <div className="box">
              <div className="tabs-list">
                {["1 sal", "2 sal", "3 sal", "4 sal"].map((floor, index) => (
                  <div
                    key={index}
                    className={`tab ${activeTab === index + 1 ? "active" : ""}`}
                    onClick={() => setActiveTab(index + 1)}
                  >
                    {floor}
                  </div>
                ))}
              </div>

              {[1, 2, 3, 4].map((floor) => (
                <div key={floor} className={`tab-panel ${activeTab === floor ? "active" : ""}`}>
                  {rooms[floor].map((room) => (
                    <div key={room} className="row">
                      <span>{room}</span>
                      <input
                        type="checkbox"
                        checked={selectedRooms.includes(room)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRooms((prev) => [...prev, room]);
                          } else {
                            setSelectedRooms((prev) => prev.filter((r) => r !== room));
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="kalenderflex">
          <p style={{ fontWeight: "bold" }}>Vælg start og slut dato<span style={{ color: "red" }}>*</span></p>
          <br />
          <div className="kalenderdiv">
            <Calendar
              getDayProps={(date) => {
                const isSelected = selected.some((s) => dayjs(date).isSame(s, "date"));
                const isBooked = bookedDates.some((b) => dayjs(date).isSame(b.created_at, "date"));

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

          <div className="bluebuttondiv">
            <BlueButton label="Lås lokale" onClick={handleLockClick} />
          </div>
        </div>
      </div>
    </div>
  );
}
