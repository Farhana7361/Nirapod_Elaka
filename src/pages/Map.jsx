import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "./Map.css";

export default function Map() {
  const [showReportButton, setShowReportButton] = useState(false);
  let selectedLat = null;
  let selectedLng = null;
  let marker = null;

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

    L.Control.geocoder({
      defaultMarkGeocode: false
    })
      .on("markgeocode", function(e) {

        selectedLat = e.geocode.center.lat;
         selectedLng = e.geocode.center.lng;

        if (marker) {
          map.removeLayer(marker);
        }

        map.setView([selectedLat, selectedLng], 18);

        marker = L.marker([selectedLat, selectedLng]).addTo(map);

      })
        .addTo(map);

    map.on("click", function(e) {

      selectedLat = e.latlng.lat;
      selectedLng = e.latlng.lng;

      console.log("Latitude:", selectedLat);
      console.log("Longitude:", selectedLng);

      if (marker) {
        map.removeLayer(marker);
      }

      marker = L.marker([selectedLat, selectedLng]).addTo(map);
      setShowReportButton(true);

    });

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
        {showReportButton && (
         <button className="report-button">
           REPORT THIS LOCATION
          </button>
        )}
        
      </div>

      <div id="right">

        <div id="map"></div>

      </div>

    </div>
  );
}