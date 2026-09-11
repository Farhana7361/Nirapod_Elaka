import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "./Map.css";
import ReportMap from "./report_map";


export default function Map() {
  const [areaName, setAreaName] = useState("");
  const [showReportButton, setShowReportButton] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedLat, setSelectedLat] = useState(null);
  const [selectedLng, setSelectedLng] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  let marker = null;

  const getAreaName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );

      const data = await response.json();

      const address = data.address;

      const name =
        address.suburb ||
        address.neighbourhood ||
        address.city_district ||
        address.city ||
        address.town ||
        address.village ||
        "Unknown area";

      setAreaName(name);

    } catch (error) {
      console.error("Failed to get area name:", error);
      setAreaName("Unknown area");
    }
  };

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

      setSelectedLat(e.geocode.center.lat);
      setSelectedLng(e.geocode.center.lng);

      if (marker) {
        map.removeLayer(marker);
      }
      map.setView(
        [e.geocode.center.lat, e.geocode.center.lng],
        18
      );

      marker = L.marker([
        e.geocode.center.lat,
        e.geocode.center.lng
        ]).addTo(map);
      })
        .addTo(map);

    map.on("click", function(e) {

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setSelectedLat(lat);
      setSelectedLng(lng);

      getAreaName(lat, lng);


      if (marker) {
        map.removeLayer(marker);
      }

      marker = L.marker([
       e.latlng.lat,
       e.latlng.lng
       ]).addTo(map);
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
        <button className="report-button" onClick={() => setShowReportForm(true)}>
            REPORT THIS LOCATION
        </button>
        )}
        
      </div>

      <div id="right">

        <div id="map"></div>

        {showReportForm && ( 
        <div className="report-container">

        <ReportMap
          onClose={() => setShowReportForm(false)}
          latitude={selectedLat}
          longitude={selectedLng}
          address={areaName}
          onSuccess={() => {
            setShowReportForm(false);
            setShowSuccess(true);

            setTimeout(() => {
              setShowSuccess(false);
            }, 3000);
          }}
        />

        </div>
        )}

      {showSuccess && (
        <div className="success-message">
          ✓ Your report has been submitted successfully!
        </div>
      )}

      </div>

    </div>
  );
}