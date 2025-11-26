"use client"

import dayjs from 'dayjs';
import { useState } from 'react';
import { Calendar } from '@mantine/dates';
import BlueButton from "../../components/BlueButton.jsx";
import "../../lokalekontrol/lokalekontrol.css";

export default function Laaslokale () {

  const [selected, setSelected] = useState([]);
  const [activeTab, setActiveTab] = useState(3); // default "3 sal"

  const rooms = {
    1: ['1.10','1.11','1.13','1.14','1.15','1.16'],
    2: ['2.10','2.11','2.13','2.14','2.15','2.16'],
    3: ['3.10','3.11','3.13','3.14','3.15','3.16'],
    4: ['4.10','4.11','4.13','4.14','4.15','4.16'],
  };

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

  return(
    <div>
      <div className="abtop">
        <img className="ablogo" src="/timeann-img.png" alt="" />
        <p className="abtext">
          Dashboard / Lokalekontrol / <span className="abp">Lås lokale</span>
        </p>
      </div>

      <div className="overskrift2">
        <p className="aboverskrift">Lås lokale</p>
      </div>

      <div className="maincontent">
        <div className="vaalglokalediv">
          <p style={{fontWeight: "bold"}}>Vælg lokale<span style={{ color: "red"}}>*</span></p>
          <br />

          {/* Tab-komponent omskrevet til React */}
          <div className='boxtab'>
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

              {[1,2,3,4].map((floor) => (
                <div
                  key={floor}
                  className={`tab-panel ${activeTab === floor ? "active" : ""}`}
                >
                  {rooms[floor].map((room) => (
                    <div key={room} className="row">
                      <span>{room}</span>
                      <input type="checkbox" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='kalenderflex'>
          <p style={{fontWeight: "bold"}}>Vælg start og slut dato<span style={{ color: "red"}}>*</span></p>
          <br />
          <div className="kalenderdiv">
            <Calendar 
              getDayProps={(date) => ({
                selected: selected.some((s) => dayjs(date).isSame(s, 'date')),
                onClick: () => handleSelect(date),
              })}
            />
          </div>
          <div className='bluebuttondiv'>
            <BlueButton 
              label="Lås lokale"
              className="bluebutton"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
