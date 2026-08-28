import React, { useState, useEffect } from "react";
import { Shield } from 'lucide-react';

export default function Profile() {
  const [isPwOpen, setIsPwOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
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
margin: 0 0 0 75px;

 
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
  }
}
.id-card {
  position: relative;
  background: linear-gradient(160deg, var(--forest-deep) 0%, var(--forest) 78%);
  border-radius: var(--radius);
  padding: 30px 20px 24px;
  overflow: hidden;
  isolation: isolate;
  position: sticky;
  top: calc(var(--nav-h) + 16px);
  
}


.id-name {
  text-align: center;
  font-family: "Tiro Bangla", serif;
  font-size: 21px;
  color: #fbfaf6;
  margin: 0 0 4px;
  padding-top:42px;
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
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: #eaf3ec;
  font-size: 11.5px;
  padding: 6px 14px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 7px;
}



.id-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.14);
  margin: 20px 0;
}

.id-stats{
    display:flex; flex-direction:column; gap:12px;
     padding-top:30px;
  }
    .id-stat{
    display:flex; align-items:center; justify-content:space-between;
    font-size:12.5px;
  }
.id-stat .k{ color:rgba(255,255,255,.6); font-family:'Inter', sans-serif; }
  .id-stat .v{ color:#F6F5F0; font-family:'IBM Plex Mono', monospace; font-size:12.5px; }

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
   color:#FFFFFF;
    background:var(--sage-tint);
    border:1px solid var(--line);
    padding:8px 14px;
    border-radius:9px;
    cursor:pointer;
    white-space:nowrap;
    transition:background .15s ease, transform .1s ease;
  }  
  
  .btn-change1:hover{ background:#DCEAE1;color: #000000; }
    .btn-change:active{ transform:scale(.97); }
    .btn-change:focus-visible{ outline:2px solid var(--forest); outline-offset:2px; }

  /* ---------- Change-password reveal ---------- */
  .pw-panel{
    display:none;
    padding:16px 0 20px;
    border-top:1px solid var(--line);
  }
  .pw-panel.open{ display:block; }
  .pw-panel-grid{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; }
  @media (max-width:640px){
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
  .pw-panel input:focus-visible{ outline:2px solid var(--forest); outline-offset:1px; }
  .pw-actions{ display:flex; gap:10px; margin-top:12px; grid-column:1 / -1; }

    .btn-primary1{
    flex:0 0 auto;
    background:var(--forest-deep);
    color:#FFFFFF;
    border:none;
    padding:11px 18px;
    border-radius:9px;
    font-family:'Inter', sans-serif; font-weight:600; font-size:13.5px;
    cursor:pointer;
  }
  .btn-primary1:hover{ background:var(--forest); }
  .btn-ghost1{
    background:transparent;
    color:#FFFFFF;
    border:1px solid var(--line);
    padding:11px 14px;
    border-radius:9px;
    font-family:'Inter', sans-serif; font-weight:600; font-size:13.5px;
    cursor:pointer;
  }

  /*    Report  */

  

.report-list{ display:flex; flex-direction:column; gap:10px; margin:14px 0 6px; }
  .report{
    border:1px solid var(--line);
    border-left:3px solid var(--gold);
    border-radius:11px;
    padding:13px 14px;
    display:flex; flex-direction:column; gap:6px;
    background:#FCFBF8;
  }


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
  .pill.review{ background:var(--gold-tint); color:#7A5620; }
  .pill.resolved{ background:#E1F0E5; color:#2B6B44; }  
  .pill.pending{ background:#EDEEEB; color:#5B655F; }
  .report-meta{
    font-size:12px; color:#000000;
    display:flex; gap:14px; flex-wrap:wrap;
  }
  .report-meta span{ display:inline-flex; align-items:center; gap:5px; }/*           


      `}</style>

      <div className="page">
        <div className="layout">
          {/* Left Column / ID Card */}
          <div className="id-card">
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
                <span className="v">3</span>
              </div>
              <div className="id-stat">
                <span className="k">Resolved</span>
                <span className="v">1</span>
              </div>
              <div className="id-stat">
                <span className="k">Under review</span>
                <span className="v">2</span>
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
                    <span className="field-value">{user?.name || "Loading..."}</span>
                </div>
                <div className="field">
                  <span className="field-label">Date of birth</span>
                  <span className="field-value">{user?.dateOfBirth || "Not provided"}</span>
                </div>
                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <span className="field-label">Email</span>
                  <span className="field-value mono">{user?.email || "Not provided"}</span>
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
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label htmlFor="new1">New password</label>
                    <input
                      type="password"
                      id="new1"
                      placeholder="At least 8 characters"
                    />
                  </div>
                  <div>
                    <label htmlFor="new2">Confirm new password</label>
                    <input
                      type="password"
                      id="new2"
                      placeholder="Re-enter new password"
                    />
                  </div>
                  <div className="pw-actions">
                    <button className="btn-primary1" type="button">
                      Save password
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
              </div>
            </section>

            <section className="panel" aria-labelledby="report-head">
              <div className="panel-head">
                <h2 id="report-head">My Report</h2>
                <span className="count">3 filed</span>
              </div>

              <div className="report-list">
                <div className="report review">
                  <div className="report-top">
                    <span className="report-title">
                      Broken streetlight, Road 7
                    </span>
                    <span className="pill review">Under review</span>
                  </div>
                  <div className="report-meta">
                    <span className="report-id">#NE-1042</span>
                    <span>Filed 3 Aug 2026</span>
                    <span>Dhanmondi</span>
                  </div>
                </div>

                <div className="report pending">
                  <div className="report-top">
                    <span className="report-title">
                      Suspicious loitering, alley behind school
                    </span>
                    <span className="pill pending">Pending review</span>
                  </div>
                  <div className="report-meta">
                    <span className="report-id">#NE-1077</span>
                    <span>Filed 12 Aug 2026</span>
                    <span>Uttara</span>
                  </div>
                </div>

                <div className="report resolved">
                  <div className="report-top">
                    <span className="report-title">
                      Open manhole near market
                    </span>
                    <span className="pill resolved">Resolved</span>
                  </div>
                  <div className="report-meta">
                    <span className="report-id">#NE-0981</span>
                    <span>Filed 21 Jun 2026</span>
                    <span>Mohammadpur</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
