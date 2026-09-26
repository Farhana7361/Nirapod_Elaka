import { useEffect, useRef, useState } from "react";
import axios from "axios";
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
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // approved reports + filters
  const [reports, setReports] = useState([]);
  const [timeFilter, setTimeFilter] = useState("All times");
  const [typeFilter, setTypeFilter] = useState("All types");
  const reportMarkersLayerRef = useRef(null);

  const getMarkerColor = (avgRating) => {
    if (avgRating >= 3.5) return "#19dd47"; // safe
    if (avgRating >= 2.5) return "#ffad19"; // caution
    return "#ed333d"; // danger
  };

  const getAreaName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
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

  const dropReportPin = (lat, lng) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    setSelectedLat(lat);
    setSelectedLng(lng);
    getAreaName(lat, lng);

    if (markerRef.current) {
      map.removeLayer(markerRef.current);
    }

    markerRef.current = L.marker([lat, lng]).addTo(map);
    setShowReportButton(true);
  };

  useEffect(() => {
    var map = L.map("map").setView([23.8103, 90.4125], 13);
    mapInstanceRef.current = map;

    var osm = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    );
    osm.addTo(map);

    reportMarkersLayerRef.current = L.layerGroup().addTo(map);

    L.Control.geocoder({
      defaultMarkGeocode: false,
    })
      .on("markgeocode", function (e) {
        map.setView([e.geocode.center.lat, e.geocode.center.lng], 18);
        dropReportPin(e.geocode.center.lat, e.geocode.center.lng);
      })
      .addTo(map);

    map.on("click", function (e) {
      dropReportPin(e.latlng.lat, e.latlng.lng);
    });
    return () => {
      map.remove();
    };
  }, []);

  // fetch approved reports once on mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/reports/approved",
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setReports(res.data);
      } catch (err) {
        console.log("Fetch Reports Error:", err.response?.data || err.message);
      }
    };

    fetchReports();
  }, []);

  // group same-spot reports, average their rating, draw one marker per spot
  useEffect(() => {
    const layer = reportMarkersLayerRef.current;
    if (!layer) return;

    layer.clearLayers();

    const filteredReports = reports.filter((r) => {
      const timeMatches = timeFilter === "All times" || r.time === timeFilter;
      const typeMatches = typeFilter === "All types" || r.type === typeFilter;
      return timeMatches && typeMatches;
    });

    // group reports that are at (roughly) the same spot — ~11m grid
    const groups = {};
    filteredReports.forEach((r) => {
      if (!r.location) return;

      const key = `${r.location.lat.toFixed(4)},${r.location.lng.toFixed(4)}`;

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(r);
    });

    Object.values(groups).forEach((group) => {
      const avgRating =
        group.reduce((sum, r) => sum + r.rating, 0) / group.length;

      const sortedGroup = [...group].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      const { lat, lng } = sortedGroup[0].location;

      const popupHtml = `
      <b>${sortedGroup[0].address || "Unknown area"}</b><br/>
      Average rating: ${avgRating.toFixed(1)}/5 (${group.length} report${group.length > 1 ? "s" : ""
        })
      <hr style="margin:6px 0;" />
      ${sortedGroup
          .map(
            (r) =>
              `<b>${r.type}</b> — ${r.rating}/5 (${r.time})<br/><span style="font-size:12px;color:#9ab5d5;">${new Date(
                r.createdAt,
              ).toLocaleDateString()}</span>`,
          )
          .join("<hr style='margin:6px 0;'/>")}
    `;

            const circle = L.circleMarker([lat, lng], {
        radius: 10,
        stroke: false,
        fillColor: getMarkerColor(avgRating),
        fillOpacity: 0.9,
      });

      let hoverPopup = null;

      circle.on("mouseover", (e) => {
        hoverPopup = L.popup({ closeButton: false, autoClose: true })
          .setLatLng(e.latlng)
          .setContent(popupHtml)
          .openOn(mapInstanceRef.current);
      });

      circle.on("mouseout", () => {
        if (hoverPopup) {
          mapInstanceRef.current.closePopup(hoverPopup);
        }
      });

      circle.on("click", (e) => {
        if (hoverPopup) {
          mapInstanceRef.current.closePopup(hoverPopup);
        }
        dropReportPin(e.latlng.lat, e.latlng.lng);
      });

      circle.addTo(layer);
    });
  }, [reports, timeFilter, typeFilter]);

  return (
    <div id="main">
      <div id="left">
        <div className="list">
          <h3>FILTER REPORTS</h3>

          <h3>Time of day</h3>

          <div className="box">
            <select
              id="timeFilter"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option>All times</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
              <option>Night</option>
            </select>
          </div>

          <h3>Incident Type </h3>

          <div className="box">
            <select
              id="typeFilter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option>All types</option>
              <option>Theft</option>
              <option>Harassment</option>
              <option>Accident</option>
              <option>Suspicious Activity</option>
              <option>No Incident</option>
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

          <p>
            Click anywhere on the map to <br /> drop a pin and file a report.
          </p>
        </div>
        {showReportButton && (
          <button
            className="report-button"
            onClick={() => setShowReportForm(true)}
          >
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
