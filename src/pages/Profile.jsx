import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import axios from "axios";

function getStatus(status) {
  if (status === "approved") {
    return { label: "Resolved", cls: "resolved" };
  } else if (status === "review" || status === "under_review") {
    return { label: "Under review", cls: "review" };
  } else if (status === "rejected") {
    return { label: "Rejected", cls: "rejected" };
  } else {
    return { label: "Pending review", cls: "pending" };
  }
}

const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function Profile() {
  const [deletingId, setDeletingId] = useState(null);
  const [isPwOpen, setIsPwOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  // reports
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  //new pw
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwStatus, setPwStatus] = useState({ type: "", message: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchMyReports = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }
      try {
        const res = await axios.get("http://localhost:5000/api/reports/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(res.data);
      } catch (err) {
        console.log("Get My Reports Error:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login", { replace: true });
          return;
        }

        setReportsError("Failed to load your reports.");
      } finally {
        setReportsLoading(false);
      }
    };
    fetchMyReports();
  }, [navigate]);

  const [editingReport, setEditingReport] = useState(null);
  const [editForm, setEditForm] = useState({
    type: "",
    description: "",
    address: "",
    rating: 0,
    time: "Morning",
  });
  const [editStatus, setEditStatus] = useState({ type: "", message: "" });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const handleEditClick = (report) => {
    setEditingReport(report);
    setEditForm({
      type: report.type,
      description: report.description,
      address: report.address,
      rating: report.rating,
      time: report.time,
    });
    setEditStatus({ type: "", message: "" });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (editForm.description.trim().length < 20) {
      setEditStatus({
        type: "error",
        message: "Description must be at least 20 characters.",
      });
      return;
    }

    setIsSavingEdit(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/reports/${editingReport._id}`,
        {
          type: editForm.type,
          description: editForm.description,
          address: editForm.address,
          rating: editForm.rating,
          time: editForm.time,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // clears reviewNote
      setReports((prev) =>
        prev.map((r) => (r._id === editingReport._id ? res.data : r)),
      );
      setEditingReport(null);
    } catch (err) {
      setEditStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to update report.",
      });
    } finally {
      setIsSavingEdit(false);
    }
  };

  // derived stats
  const totalReports = reports.length;
  const resolvedCount = reports.filter((r) => r.status === "approved").length;
  const underReviewCount = reports.filter(
    (r) => r.status === "review" || r.status === "pending",
  ).length;

  //  input changes
  const handlePwInput = (e) => {
    const { id, value } = e.target;
    const keyMap = {
      cur: "currentPassword",
      new1: "newPassword",
      new2: "confirmPassword",
    };
    setPasswordData((prev) => ({ ...prev, [keyMap[id]]: value }));
  };

  const handlePasswordSubmit = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwStatus({ type: "error", message: "All fields are required." });
      return;
    }
    if (newPassword.length < 8) {
      setPwStatus({
        type: "error",
        message: "New password must be at least 8 characters.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwStatus({ type: "error", message: "New passwords do not match." });
      return;
    }

    setPwStatus({ type: "", message: "" });
    setIsUpdating(true);

    try {
      const token = localStorage.getItem("token"); // Retrieve token

      const response = await axios.put(
        "http://localhost:5000/api/auth/change-password",
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setPwStatus({
        type: "success",
        message: "Password updated successfully!",
      });

      setTimeout(() => {
        setIsPwOpen(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPwStatus({ type: "", message: "" });
      }, 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to update password. Check current password.";
      setPwStatus({ type: "error", message: msg });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    const confirmed = window.confirm(
      "Delete this report? This cannot be undone.",
    );
    if (!confirmed) return;

    setDeletingId(reportId);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports((prev) => prev.filter((r) => r._id !== reportId));
    } catch (err) {
      console.log("Delete Report Error:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
        return;
      }
      alert(err.response?.data?.message || "Failed to delete report.");
    } finally {
      setDeletingId(null);
    }
  };
  return (
    <>
      <style>{`
        :root {
      --bg: #10151f;
      --panel: #171e2c;
      --ink: #e9ecf3;
      --ink-soft: #9aa4ba;
      --line: #2b3548;
      --forest: #1b4332;
      --forest-deep: #0e2a20;
      --sage-tint: rgba(62, 207, 142, 0.10);
      --gold: #f5a623;
      --gold-tint: rgba(245, 166, 35, 0.12);
      --danger: #ef4f4f;
      --radius: 18px;
       --nav-h: 80px; 
      }


body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: "Inter", "Hind Siliguri", sans-serif;
   padding: calc(var(--nav-h) + 24px) 0px 0px 0px;
}
.page {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
  box-sizing: border-box;
}

.layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 48px;
  align-items: start;
}
@media (max-width: 760px) {
  .layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .id-card {
    position: static;
  }
}

.id-card {
  position: relative;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 30px 20px 24px;
  overflow: hidden;
  isolation: isolate;
  position: sticky;
  top: calc(var(--nav-h) + 16px);
}
.id-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border: 3px solid rgba(255, 255, 255, 0.18);
  color: #fbfaf6;
  font-family: "Tiro Bangla", serif;
  font-size: 30px;
  font-weight: 600;
}

.id-name {
  text-align: center;
  font-family: "Tiro Bangla", serif;
  font-size: 21px;
  color: #fbfaf6;
  margin: 0 0 4px;
  padding-top:12px;
}
.id-sub {
  text-align: center;
  font-family: "IBM Plex Mono", monospace;
  font-size: 10.5px;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.62);
  margin: 0;
}
.id-badge {
  margin: 16px auto 0;
  width: fit-content;
  background: rgba(245, 166, 35, 0.12);
  border: 1px solid rgba(245, 166, 35, 0.3);
  color: #f5a623;
  font-size: 11.5px;
  padding: 6px 14px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 7px;
}

.id-divider {
  height: 1px;
  background: var(--line);
  margin: 20px 0;
}

.id-stats{
    display:flex; flex-direction:column; gap:12px;
     padding-top:30px;
  }
    .id-stat{
    display:flex; align-items:center; justify-content:space-between;
    font-size:13px;
  }
  .id-stat .k{ color:rgba(255,255,255,.8); font-family:'Inter', sans-serif; font-weight:600; }
  .id-stat .v{ color:#F6F5F0; font-family:'IBM Plex Mono', monospace; font-size:13px; font-weight:600; }

  .main-col{
    display:flex; flex-direction:column; gap:18px;
  }
   .panel{
    background:var(--panel);
    border:1px solid var(--line);
    border-radius:var(--radius);
    padding:22px 22px 8px;
  }
  .panel-head{
    display:flex; align-items:baseline; justify-content:space-between;
    margin-bottom:14px;
  }
  .panel-head h2{
    font-family:'Tiro Bangla', serif;
    font-weight:400;
    font-size:17px;
    color:#FFFFFF;
    margin:0;
    display:flex; align-items:center; gap:9px;
  }
  .panel-head h2::before{
    content:"";
    width:4px; height:16px;
    background:var(--gold);
    border-radius:2px;
    display:inline-block;
  }


    .field-grid{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:0 24px;
  }

    @media (max-width:520px){
    .field-grid{ grid-template-columns:1fr; }
  }
  .field{
    display:flex; align-items:center; justify-content:space-between;
    gap:14px;
    padding:14px 0;
    border-top:1px solid var(--line);
  }
   .field-grid .field:nth-child(-n+2){ border-top:none; } /*for remove the upper line*/

     @media (max-width:520px){
    .field-grid .field:first-of-type{ border-top:none; }
    .field-grid .field:nth-child(2){ border-top:1px solid var(--line); }
  }

    .field-label{
    font-size:11px; letter-spacing:.06em; text-transform:uppercase;
    color:var(--ink-soft);
    font-family:'Inter', sans-serif; font-weight:500;
    flex-shrink:0;
  }
  .field-value{
    flex:1;
    font-size:15px; color:var(--ink);
    text-align:right;
  }
  .field-value.mono{ font-family:'IBM Plex Mono', monospace; font-size:14px; letter-spacing:.03em; }
  .pw-row{
    display:flex; align-items:center; justify-content:space-between;
    gap:14px; padding:14px 0; border-top:1px solid var(--line);
    margin-top:0;
  }
  .pw-dots{
    font-family:'IBM Plex Mono', monospace;
    letter-spacing:.28em; font-size:15px; color:var(--ink);

  }
  .btn-change1{
    font-family:'Inter', sans-serif;
    font-size:12.5px; font-weight:600;
    color:rgba(245, 166, 35, 0.85);
    background:rgba(245, 166, 35, 0.08);
    border:1px solid rgba(245, 166, 35, 0.2);
    padding:8px 14px;
    border-radius:9px;
    cursor:pointer;
    white-space:nowrap;
    transition:background .15s ease, color .15s ease, transform .1s ease, border-color .15s ease;
  }  
  
  .btn-change1:hover{ background:rgba(245, 166, 35, 0.2); color:#f5a623; border-color:rgba(245, 166, 35, 0.4); }
  .btn-change1:active{ transform:scale(.97); }
  .btn-change1:focus-visible{ outline:2px solid rgba(245, 166, 35, 0.5); outline-offset:2px; }

  /* ---------- Change-password reveal ---------- */
  .pw-panel{
    display:none;
    padding:16px 0 20px;
    border-top:1px solid var(--line);
  }
  .pw-panel.open{ display:block; }
  .pw-panel-grid{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; }
  
  @media (max-width:760px){
    .pw-panel-grid{ grid-template-columns:1fr; }
  }
  .pw-panel label{
    font-size:11px; text-transform:uppercase; letter-spacing:.06em;
    color:var(--ink-soft); font-weight:500; margin-bottom:5px; display:block;
  }
  .pw-panel input{
    box-sizing: border-box;
    width:100%;
    font-family:'IBM Plex Mono', monospace;
    font-size:14px;
    padding:10px 12px;
    border-radius:9px;
    border:1px solid var(--line);
    background:var(--bg);
    color:var(--ink);
  }
  .pw-panel input:focus-visible{ outline:2px solid rgba(245, 166, 35, 0.6); outline-offset:1px; }
  .pw-actions{ display:flex; gap:10px; margin-top:12px; grid-column:1 / -1; }

  .btn-primary1{
    flex:0 0 auto;
    background:rgba(245, 166, 35, 0.08);
    color:rgba(245, 166, 35, 0.85);
    border:1px solid rgba(245, 166, 35, 0.2);
    padding:11px 18px;
    border-radius:9px;
    font-family:'Inter', sans-serif; font-weight:600; font-size:13.5px;
    cursor:pointer;
    transition:background .15s ease, color .15s ease, transform .1s ease, border-color .15s ease;
  }
  .btn-primary1:hover{
    background:rgba(245, 166, 35, 0.2);
    color:#f5a623;
    border-color:rgba(245, 166, 35, 0.4);
  }
  .btn-primary1:active{ transform:scale(.97); }
  .btn-primary1:focus-visible{ outline:2px solid rgba(245, 166, 35, 0.5); outline-offset:2px; }
  .btn-primary1:disabled{ opacity:0.5; cursor:not-allowed; }
  .btn-ghost1{
    background:transparent;
    color:#FFFFFF;
    border:1px solid var(--line);
    padding:11px 14px;
    border-radius:9px;
    font-family:'Inter', sans-serif; font-weight:600; font-size:13.5px;
    cursor:pointer;
  }

.pw-row div {
  display: flex;
  gap: 8px;
}
/* pass change error */

        .pw-status { font-size: 13px; margin-top: 10px; font-weight: 500; }
        .pw-status.error { color: #ef4f4f; }
        .pw-status.success { color: #3ecf8e; }


  /*    Report  */


.report-list {
display:flex; flex-direction:column; gap:10px; margin:14px 0 6px; 
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
}
  .report{
    border:1px solid var(--line);
    border-left:3px solid #b8860b;
    border-radius:11px;
    padding:13px 14px;
    display:flex; flex-direction:column; gap:6px;
    background:#FCFBF8;
  }

  .report.review{ border-left-color:#b8860b; }
  .report.resolved{ border-left-color:#3F8F5F; }
  .report.pending{ border-left-color:#9AA79E; }
  .report-top{
    display:flex; align-items:flex-start; justify-content:space-between; gap:10px;
  }
  .report-title{ font-size:14.5px; font-weight:600; color:#000000; }
  .report-id{
    font-family:'IBM Plex Mono', monospace; font-size:10.5px;
    color:#000000;
  }
  .pill{
    font-family:'IBM Plex Mono', monospace;
    font-size:10px; letter-spacing:.04em;
    padding:4px 9px; border-radius:999px;
    white-space:nowrap; flex-shrink:0;
  }
  .pill.review{
    background: rgba(184, 134, 11, 0.08);
    color: #b8860b;
    border: 1px solid rgba(184, 134, 11, 0.45);
    font-weight: 600;
  }
  .pill.resolved{
    background: rgba(43, 107, 68, 0.08);
    color: #2B6B44;
    border: 1px solid rgba(43, 107, 68, 0.45);
    font-weight: 600;
  }  
  .pill.pending{
    background: rgba(91, 101, 95, 0.08);
    color: #5B655F;
    border: 1px solid rgba(91, 101, 95, 0.45);
    font-weight: 600;
  }
  .pill.rejected{
    background: rgba(239, 79, 79, 0.08);
    color: #ef4f4f;
    border: 1px solid rgba(239, 79, 79, 0.45);
    font-weight: 600;
  }
  .report-meta{
    font-size:12px; color:#000000;
    display:flex; gap:14px; flex-wrap:wrap;
  }
  .report-meta span{ display:inline-flex; align-items:center; gap:5px; }
  
   .report-delete-btn {
  background: none;
  border: none;
  color: #9aa4ba;
  font-size: 13px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
}

.report-delete-btn:hover {
  background: rgba(239, 79, 79, 0.12);
  color: var(--danger);
}

.report-delete-btn:disabled {
  opacity: 0.5;
  cursor: default;
} 
  

.report-edit-btn {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: .04em;
  font-weight: 600;
  background: rgba(184, 134, 11, 0.08);
  color: #b8860b;
  border: 1px solid rgba(184, 134, 11, 0.45);
  padding: 4px 9px;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.report-edit-btn:hover {
  background: rgba(184, 134, 11, 0.2);
  border-color: rgba(184, 134, 11, 0.7);
}
.edit-modal-overlay {
  padding: 16px;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.edit-modal-box {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 24px;
  width: 100%;
  max-width: 420px;
  max-height: 90vh; 
  overflow-y: auto;
}
.edit-modal-box label {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  color: var(--ink-soft);
  margin: 12px 0 6px;
}
.edit-modal-box input,
.edit-modal-box select,
.edit-modal-box textarea {
  width: 100%;
  box-sizing: border-box;
  background: var(--bg);
  border: 1px solid var(--line);
  color: var(--ink);
  border-radius: 8px;
  padding: 8px 10px;
}


.edit-modal-box input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: calc(100% + 18px);
  margin-left: -9px;
  height: 6px;
  padding: 0;
  background: var(--line);
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.edit-modal-box input[type="range"]::-webkit-slider-runnable-track {
  height: 6px;
  background: var(--line);
  border-radius: 3px;
}

.edit-modal-box input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #5b8def;
  cursor: pointer;
  margin-top: -6px;
}

.edit-modal-box input[type="range"]::-moz-range-track {
  height: 6px;
  background: var(--line);
  border-radius: 3px;
}

.edit-modal-box input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #5b8def;
  cursor: pointer;
  border: none;
}
  
  /*    



      `}</style>

      <div className="page">
        <div className="layout">
          {/* Left Column / ID Card */}
          <div className="id-card">
            <div className="id-avatar">
              {user?.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <p className="id-name">{user?.name || "Loading..."}</p>
            <p className="id-sub">MEMBER SINCE MAR 2023 · DHAKA</p>
            <div className="id-badge">
              <Shield size={14} />
              Resident safety profile
            </div>
            <div className="id-divider"></div>
            <div className="id-stats">
              <div className="id-stat">
                <span className="k">Reports filed</span>
                <span className="v">{totalReports}</span>
              </div>
              <div className="id-stat">
                <span className="k">Resolved</span>
                <span className="v">{resolvedCount}</span>
              </div>
              <div className="id-stat">
                <span className="k">Under review</span>
                <span className="v">{underReviewCount}</span>
              </div>
            </div>
          </div>

          {/* Right Column / Main Panels */}
          <div className="main-col">
            <section className="panel" aria-labelledby="profile-head">
              <div className="panel-head">
                <h2 id="profile-head">Profile</h2>
              </div>

              <div className="field-grid">
                <div className="field">
                  <span className="field-label">Full name</span>
                  <span className="field-value">
                    {user?.name || "Loading..."}
                  </span>
                </div>
                <div className="field">
                  <span className="field-label">NID</span>
                  <span className="field-value">
                    {user?.identity || "Not provided"}
                  </span>
                </div>
                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <span className="field-label">Email</span>
                  <span className="field-value mono">
                    {user?.email || "Not provided"}
                  </span>
                </div>
              </div>

              <div className="pw-row">
                <span className="field-label">Password</span>
                <span className="pw-dots">••••••••••</span>
                <button
                  className="btn-change1"
                  id="pwToggle"
                  type="button"
                  aria-expanded={isPwOpen}
                  aria-controls="pwPanel"
                  onClick={() => setIsPwOpen((prev) => !prev)}
                >
                  {isPwOpen ? "Close" : "Change"}
                </button>
              </div>

              <div
                className={`pw-panel ${isPwOpen ? "open" : ""}`}
                id="pwPanel"
              >
                <div className="pw-panel-grid">
                  <div>
                    <label htmlFor="cur">Current password</label>
                    <input
                      type="password"
                      id="cur"
                      value={passwordData.currentPassword}
                      onChange={handlePwInput}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label htmlFor="new1">New password</label>
                    <input
                      type="password"
                      id="new1"
                      value={passwordData.newPassword}
                      onChange={handlePwInput}
                      placeholder="At least 8 characters"
                    />
                  </div>
                  <div>
                    <label htmlFor="new2">Confirm new password</label>
                    <input
                      type="password"
                      id="new2"
                      value={passwordData.confirmPassword}
                      onChange={handlePwInput}
                      placeholder="Re-enter new password"
                    />
                  </div>
                  <div className="pw-actions">
                    <button
                      className="btn-primary1"
                      type="button"
                      onClick={handlePasswordSubmit}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Saving..." : "Save password"}
                    </button>
                    <button
                      className="btn-ghost1"
                      type="button"
                      id="pwCancel"
                      onClick={() => setIsPwOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {pwStatus.message && (
                  <div className={`pw-status ${pwStatus.type}`}>
                    {pwStatus.message}
                  </div>
                )}
              </div>
            </section>

            <section className="panel" aria-labelledby="report-head">
              <div className="panel-head">
                <h2 id="report-head">My Report</h2>
                <span className="count">{totalReports} filed</span>
              </div>

              <div className="report-list">
                {reportsLoading && <p>Loading your reports...</p>}

                {!reportsLoading && reportsError && (
                  <p style={{ color: "#ef4f4f" }}>{reportsError}</p>
                )}

                {!reportsLoading && !reportsError && reports.length === 0 && (
                  <p>You haven't filed any reports yet.</p>
                )}
                {!reportsLoading &&
                  !reportsError &&
                  reports.map((r) => {
                    const status = getStatus(r.status);

                    return (
                      <div className={`report ${status.cls}`} key={r._id}>
                        <div className="report-top">
                          <span className="report-title">{r.type}</span>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <span className={`pill ${status.cls}`}>
                              {status.label}
                            </span>

                            {(r.status === "review" ||
                              r.status === "under_review") && (
                              <button
                                onClick={() => handleEditClick(r)}
                                className="report-edit-btn"
                              >
                                Edit
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteReport(r._id)}
                              disabled={deletingId === r._id}
                              className="report-delete-btn"
                            >
                              {deletingId === r._id ? "..." : "✕"}
                            </button>
                          </div>
                        </div>

                        {r.status === "review" && r.reviewNote && (
                          <p
                            style={{
                              color: "#b8860b",
                              fontSize: "12px",
                              fontWeight: "600",
                              marginTop: "4px",
                            }}
                          >
                            Admin feedback: {r.reviewNote}
                          </p>
                        )}

                        <div className="report-meta">
                          <span className="report-id">
                            #{r._id.slice(-6).toUpperCase()}
                          </span>

                          <span>Filed {formatDate(r.createdAt)}</span>
                          <span>{r.address}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>
          </div>
        </div>
      </div>

      {editingReport && (
        <div className="edit-modal-overlay">
          <div className="edit-modal-box">
            <h3>Edit & Resubmit Report</h3>

            <form onSubmit={handleEditSubmit}>
              <label>Incident Type</label>
              <select
                value={editForm.type}
                onChange={(e) =>
                  setEditForm({ ...editForm, type: e.target.value })
                }
              >
                <option value="Theft">Theft</option>
                <option value="Harassment">Harassment</option>
                <option value="Accident">Accident</option>
                <option value="Suspicious Activity">Suspicious Activity</option>
              </select>

              <label>Time of Day</label>
              <select
                value={editForm.time}
                onChange={(e) =>
                  setEditForm({ ...editForm, time: e.target.value })
                }
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>

              <label>Address</label>
              <input
                value={editForm.address}
                onChange={(e) =>
                  setEditForm({ ...editForm, address: e.target.value })
                }
              />

              <label>Rating: {editForm.rating}</label>
              <input
                type="range"
                min="0"
                max="5"
                value={editForm.rating}
                onChange={(e) =>
                  setEditForm({ ...editForm, rating: Number(e.target.value) })
                }
              />

              <label>Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
              <p
                style={{
                  fontSize: "12px",
                  color:
                    editForm.description.trim().length >= 20
                      ? "#3ecf8e"
                      : "#ef4f4f",
                }}
              >
                {editForm.description.trim().length} / 20 characters minimum
              </p>

              {editStatus.message && (
                <p style={{ color: "#ef4f4f", fontSize: "13px" }}>
                  {editStatus.message}
                </p>
              )}

              <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="btn-primary1"
                >
                  {isSavingEdit ? "Saving..." : "Save & Resubmit"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingReport(null)}
                  className="btn-ghost1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
