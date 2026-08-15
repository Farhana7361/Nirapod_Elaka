import { useEffect } from "react";
import "./Map.css";

export default function Map() {

  useEffect(() => {
    var map = L.map("map").setView([23.8103, 90.4125], 13);

    var osm = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    );
    osm.addTo(map);

    return () => {
      map.remove();
    };

  }, []);

  return (
    <div id="main">

      <div id="left">
        <div className="list">

          <h3>FILTER REPORTS</h3>

          <h3>Time of day</h3>

          <div className="box">
            <select id="time">
              <option>All times</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
              <option>Night</option>
            </select>
          </div>

          <h3>Incident Type </h3>

          <div className="box">
            <select id="time">
              <option>Theft</option>
              <option>Harassment</option>
              <option>Accident</option>
              <option>Suspicious Activity</option>
             </select>
          </div>

        </div>

        <div id="text">
          <h4>LEGEND</h4>
          <div className="risk-item">
            <span className="dot safe"></span>
              <span>4-5 · Safer</span>
          </div>

          <div className="risk-item">
            <span className="dot caution"></span>
            <span>3 · Caution</span>
          </div>

          <div className="risk-item">
            <span className="dot danger"></span>
            <span>1-2 · High risk</span>
          </div>
        </div>
        <div className="report-box">
          <h3>REPORT A LOCATION</h3>

          <p>Click anywhere on the map to <br /> drop a pin and file a report.</p>
        </div>
        
      </div>

      <div id="right">

        <div id="map"></div>

      </div>

    </div>
  );
}