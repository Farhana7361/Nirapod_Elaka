import { useState } from "react";
import axios from "axios";
import "./report_map.css";

export default function ReportMap({ onClose, latitude, longitude, onSuccess, address }) {

  const [time, setTime] = useState("Morning");
  const [type, setType] = useState("Theft");
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");

  const submitReport = async (e) => {

    e.preventDefault();

    if (description.trim().length < 20) {
      return;
    }

    const reportData = {
      lat: latitude,
      lng: longitude,
      address,
      time,
      type,
      rating,
      description
    };

    try {
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/reports", reportData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onSuccess();
    } catch (err) {
      console.log("Submit Report Error:", err.response?.data || err.message);
    }

  };


  return (

    <div className="report-map">


      {/* TOP PART */}

      <div className="report-header">

        <h2>REPORT INCIDENT</h2>

        <button
          className="close-button"
          onClick={onClose}
        >
          ×
        </button>

      </div>



      {/* FORM */}

      <form onSubmit={submitReport}>


        {/* INCIDENT TIME */}

        <div className="form-group">

          <label>Incident Time</label>

          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >

            <option value="Morning">Morning</option>

            <option value="Afternoon">Afternoon</option>

            <option value="Evening">Evening</option>

            <option value="Night">Night</option>

          </select>

        </div>



        {/* INCIDENT TYPE */}

        <div className="form-group">

          <label>Incident Type</label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          > 
            <option value="Theft">Theft</option>

            <option value="Harassment">Harassment</option>

            <option value="Accident">Accident</option>

            <option value="Suspicious Activity">
              Suspicious Activity
            </option>

            <option value="No Incident">No Incident</option>

          </select>

        </div>



        {/* PLACE RATING */}

        <div className="form-group">

          <div className="rating-header">

            <label>Place Rating</label>

            <span>{rating}</span>

          </div>


          <input
            type="range"
            min="0"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className={`rating-slider rating-${rating}`}
          />


          <div className="rating-number">

            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>

          </div>

        </div>



        {/* DESCRIPTION */}

        <div className="form-group">

          <label>
            Write briefly about incident
          </label>


          <textarea
            placeholder="Describe what happened..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          >
          </textarea>


          <p
            className={
              description.trim().length >= 20
                ? "character valid"
                : "character"
            }
          >
            {description.trim().length} / 20 characters minimum
          </p>

        </div>



        {/* SUBMIT */}

        <button
          type="submit"
          className="submit-button"
          disabled={description.trim().length < 20}
        >
          SUBMIT REPORT
        </button>


      </form>

    </div>
  );
}