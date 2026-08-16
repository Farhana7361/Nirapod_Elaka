export default function Profile() {
  return (
    <>
      <style>{`
    :root {
      --bg: #10151f;
      --panel: #171e2c;
      --ink: #e9ecf3;
      --ink-soft: #9aa4ba;
      --line: #2b3548;
      --forest: #3ecf8e;
      --forest-deep: #18513e;
      --sage-tint: rgba(62, 207, 142, 0.10);
      --gold: #f5a623;
      --gold-tint: rgba(245, 166, 35, 0.12);
      --danger: #ef4f4f;
      --radius: 18px;
      }

body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: 'Inter', 'Hind Siliguri', sans-serif;
  -webkit-font-smoothing: antialiased;
}

.page {
  width: 100%;
  max-width: 560px;
  margin: 100px auto 80px; 
  padding: 0 16px;
}

        .id-card {
          position: relative;
          background: linear-gradient(160deg, var(--forest-deep) 0%, var(--forest) 78%);
          border-radius: var(--radius);
          padding: 34px 24px 26px;
          overflow: hidden;
          isolation: isolate;
          margin-bottom: 18px;
        }

        .id-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 88% -10%, rgba(255,255,255,.10), transparent 55%),
            repeating-linear-gradient(135deg, rgba(255,255,255,.035) 0 1px, transparent 1px 26px);
          z-index: -1;
        }

        .id-name {
          text-align: center;
          font-family: 'Tiro Bangla', serif;
          font-size: 23px;
          color: #FBFAF6;
          margin: 0 0 4px;
        }

        .id-sub {
          text-align: center;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: .08em;
          color: rgb(255, 255, 255);
          margin: 0;
        }

        .panel {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          padding: 22px 22px 8px;
          margin-bottom: 18px;
        }

        .panel-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .panel-head h2 {
         
          font-size: 17px;
          font-weight:bold;
          color: var(--forest-deep);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .panel-head h2::before {
          content: "";
          width: 4px;
          height: 16px;
          background: var(--gold);
          border-radius: 2px;
          display: inline-block;
        }

        .field {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 14px 0;
          border-top: 1px solid var(--line);
        }

        

        .field-label {
          font-size: 11px;
          letter-spacing: .06em;
          text-transform: uppercase;
          color: var(--ink-soft);
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          flex-shrink: 0;
          width: 118px;
        }

        .field-value {
          flex: 1;
          font-size: 15px;
          color: var(--ink);
          text-align: right;
        }

        .field-value.mono {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 14px;
          letter-spacing: .03em;
        }

        .pw-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 14px 0;
          border-top: 1px solid var(--line);
        }

        .btn-change {
          font-family: 'Inter', sans-serif;
          font-size: 12.5px;
          font-weight: 600;
          color: #fcfbfb;
          background: var(--sage-tint);
          border: 1px solid var(--line);
          padding: 8px 14px;
          border-radius: 9px;
          cursor: pointer;
          white-space: nowrap;
          transition: background .15s ease, transform .1s ease;
        }
             .report-list{ display:flex; flex-direction:column; gap:10px; margin:14px 0 6px; }

             .report{
             border:1px solid var(--line);
             border-left:3px solid var(--gold);
             border-radius:11px;
             padding:13px 14px;
             display:flex; flex-direction:column; gap:6px;
             background:#171e2c;
             }
             
             .report-top{
              display:flex; align-items:flex-start; justify-content:space-between; gap:10px;
              }
              .report-title{ font-size:14.5px; font-weight:600; color:var(--ink); }
              .report-id{
                font-family:'IBM Plex Mono', monospace; font-size:10.5px;
                color:var(--ink-soft);
                }
                
                .pill.review{
                  font-family:'IBM Plex Mono', monospace;
                  font-size:10px; letter-spacing:.04em;
                  padding:4px 9px; border-radius:999px;
                  white-space:nowrap; flex-shrink:0;
                  background:var(--gold-tint); color:#eab15b; 
                  }
                  
                  
                  
                  
                  .report-meta{
                    font-size:12px; color:var(--ink-soft);
                    display:flex; gap:14px; flex-wrap:wrap;
                    }
                    .report-meta span{ display:inline-flex; align-items:center; gap:5px; }
                    
                    
                    
                    


      `}</style>

      <div className="page">
        <div className="id-card">
          <p className="id-name">Farhana Rahman</p>
          <p className="id-sub">MEMBER SINCE MAR 2023 · DHAKA</p>
        </div>

        <section className="panel" aria-labelledby="profile-head">
          <div className="panel-head">
            <h2 id="profile-head">Profile</h2>
          </div>

          <div className="field">
            <span className="field-label">Full name</span>
            <span className="field-value">Farhana Rahman</span>
          </div>
          <div className="field">
            <span className="field-label">Email</span>
            <span className="field-value mono">farhanarahman@gmail.com</span>
          </div>
          <div className="field">
            <span className="field-label">Date of birth</span>
            <span className="field-value">12 March 1994</span>
          </div>

          <div className="pw-row">
            <span className="field-label">Password</span>
            <span className="pw-dots">••••••••••</span>
            <button className="btn-change">Change</button>
          </div>
        </section>

        <section className="panel" aria-labelledby="report-head">
          <div className="panel-head">
            <h2 id="report-head">My Report</h2>
          </div>
          <div class="report-list">
      <div class="report review">
        <div class="report-top">
          <span class="report-title">Broken streetlight, Road 7</span>
          <span class="pill review">Under review</span>
        </div>
        <div class="report-meta">
          <span class="report-id">#NE-1042</span>
          <span>Filed 3 Aug 2026</span>
          <span>Dhanmondi</span>
        </div>
      </div>
      </div>
          
        </section>
      </div>
    </>
  );
}
