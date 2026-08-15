import { Link } from 'react-router';
import { MapPin, Edit3, SlidersHorizontal, ChartNoAxesColumn, BadgeCheck, User } from 'lucide-react';
import './Landing.css';

export default function Landing() {
  return (
    <div>
      {/* Hero Section */}
<section className="relative px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
  <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

    {/* LEFT: copy */}
    <div>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#e0a340]/40 bg-[#e0a340]/10 text-[#e0a340] text-xs font-semibold tracking-widest mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-[#e0a340]" />
        CROWDSOURCED · REAL-TIME · OPEN
      </div>

      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        Know Your Area.
        <br />
        <span className="text-[#34d399]">Stay Safe.</span>
      </h1>

      <p className="opacity-70 mb-8 max-w-md">
        Nirapod Elaka is Bangladesh's community-powered safety platform.
        Report incidents, explore live safety ratings, and help build safer neighborhoods — together.
      </p>

      <div className="flex flex-wrap gap-3">
        <Link to="/login" className="btn btn-primary">
          Get Started — It's Free →
        </Link>
        <Link to="/map" className="btn btn-outline">
          Explore the Live Map
        </Link>
      </div>
    </div>

    {/* RIGHT: live map mock*/}
    <div className="relative">
      {/* decorative floating pins */}
      <MapPin
        className="hidden lg:block absolute -left-8 top-1/2 text-[#34d399]"
        size={28}
        fill="#34d399"
        fillOpacity={0.15}
      />
      <MapPin
        className="hidden lg:block absolute left-16 -bottom-10 text-[#e0a340]"
        size={32}
        fill="#e0a340"
        fillOpacity={0.15}
      />
      <MapPin
        className="hidden lg:block absolute -right-4 -bottom-6 text-[#34d399]"
        size={22}
        fill="#34d399"
        fillOpacity={0.15}
      />

      <div className="rounded-2xl border border-white/10 bg-[#0d1420] shadow-2xl overflow-hidden">
        {/* browser chrome bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ef4f4f]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#e0a340]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
          <span className="ml-3 text-xs opacity-50 font-mono">
            nirapod-elaka.app · Live Map
          </span>
        </div>

        <div className="flex">
          {/* map grid */}
          <div className="relative flex-1 grid grid-cols-5 grid-rows-4 gap-2 p-4 min-h-[280px]">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="rounded-md bg-white/[0.04]" />
            ))}

            {/* pins */}
            <span className="absolute rounded-full bg-[#34d399] ring-4 ring-[#34d399]/20 w-4 h-4" style={{ top: '18%', left: '30%' }} />
            <span className="absolute rounded-full bg-[#e0a340] ring-4 ring-[#e0a340]/20 w-4 h-4" style={{ top: '15%', left: '75%' }} />
            <span className="absolute rounded-full bg-[#e0a340] ring-4 ring-[#e0a340]/20 w-4 h-4" style={{ top: '68%', left: '22%' }} />
            <span className="absolute rounded-full bg-[#ef4f4f] ring-4 ring-[#ef4f4f]/20 w-4 h-4" style={{ top: '68%', left: '48%' }} />
            <span className="absolute rounded-full bg-[#34d399] ring-4 ring-[#34d399]/20 w-4 h-4" style={{ top: '46%', left: '80%' }} />

            {/* report popup */}
            <div className="absolute bottom-3 left-3 right-14 bg-[#111a29] border border-white/10 rounded-lg px-3 py-2 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ef4f4f]" />
                Theft · Evening
              </div>
              <p className="text-[11px] opacity-60 mt-0.5">Rating: 2/5 · 3 min ago</p>
            </div>
          </div>

          {/* filters + legend sidebar */}
          <div className="hidden sm:flex w-28 flex-col gap-4 p-3 border-l border-white/10 bg-white/[0.02] text-xs">
            <div>
              <p className="opacity-40 tracking-widest text-[10px] mb-2">FILTERS</p>
              <div className="flex flex-col gap-1.5">
                <span className="px-2 py-1 rounded border border-[#e0a340]/50 text-[#e0a340] text-center">All</span>
                <span className="px-2 py-1 rounded border border-white/10 opacity-60 text-center">Day</span>
                <span className="px-2 py-1 rounded border border-white/10 opacity-60 text-center">Night</span>
              </div>
            </div>
            <div>
              <p className="opacity-40 tracking-widest text-[10px] mb-2">LEGEND</p>
              <div className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#34d399]" />Safe
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#e0a340]" />Caution
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ef4f4f]" />Danger
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
      

      {/* FEATURES SECTION */}
      <section className="features-section">
        <div className="features-header">
          <span className="eyebrow">FEATURES</span>
          <h2>Everything you need to stay informed</h2>
          <p>A complete safety intelligence platform built by the community, for the community.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card hover-green">
            <div className="icon-badge green">
              <MapPin size={22} color="#34d399" />
            </div>
            <h3>Live Safety Map</h3>
            <p>Color-coded pins on an interactive OpenStreetMap. Green, amber, and red at a glance — no jargon, no guesswork.</p>
          </div>

          <div className="feature-card hover-amber">
            <div className="icon-badge amber">
              <Edit3 size={22} color="#e0a340" />
            </div>
            <h3>Reporting</h3>
            <p>File a report with a single click. Your identity is stored privately — the public only sees the safety data.</p>
          </div>

          <div className="feature-card hover-violet">
            <div className="icon-badge violet">
              <SlidersHorizontal size={22} color="#8b7af5" />
            </div>
            <h3>Smart Filters</h3>
            <p>Filter by time of day (morning, afternoon, night) and incident type to find exactly the data you care about.</p>
          </div>

          <div className="feature-card hover-sky">
            <div className="icon-badge sky">
              <ChartNoAxesColumn size={22} color="#60a5fa" />
            </div>
            <h3>Community Impact</h3>
            <p>Public stats page shows total reports, contributors, average safety ratings, incident breakdowns, and top flagged zones.</p>
          </div>

          <div className="feature-card hover-rose">
            <div className="icon-badge rose">
              <BadgeCheck size={22} color="#f45e5e" />
            </div>
            <h3>Community Moderation</h3>
            <p>Users can flag false or misleading reports. Admins review a queue to keep the data clean and trustworthy.</p>
          </div>

          <div className="feature-card hover-amber">
            <div className="icon-badge amber">
              <User size={22} color="#e0a340" />
            </div>
            <h3>Personal History</h3>
            <p>Track, edit, or delete your own reports from a private dashboard. Full control over your contributions.</p>
          </div>
        </div>
      </section>
      {/* HOW IT WORKS SECTION */}
<section className="how-it-works-section">
  <div className="how-it-works-header">
    <span className="eyebrow">HOW IT WORKS</span>
    <h2>Report in 30 seconds. Help in an instant.</h2>
    <p>No complex forms, no bureaucracy. Just you, the map, and your neighbourhood.</p>
  </div>

  <div className="how-it-works-grid">
    {/* LEFT SIDE: steps */}
    <div>
      <div className="step-list">
        <div className="step-item">
          <span className="step-number">01</span>
          <div>
            <h4>Create your account</h4>
            <p>Register anonymously — only you know who you are. Reports are always publicly anonymous.</p>
          </div>
        </div>

        <div className="step-item">
          <span className="step-number">02</span>
          <div>
            <h4>Click anywhere on the map</h4>
            <p>Tap or click any location to open the report form. Drag to get the exact spot.</p>
          </div>
        </div>

        <div className="step-item">
          <span className="step-number">03</span>
          <div>
            <h4>Rate and describe</h4>
            <p>Choose a 1–5 safety rating, pick the incident type, time of day, and add an optional note.</p>
          </div>
        </div>

        <div className="step-item">
          <span className="step-number">04</span>
          <div>
            <h4>Publish & contribute</h4>
            <p>Your pin appears on the live map immediately, helping everyone in the community.</p>
          </div>
        </div>
      </div>

      <Link to="/signup" className="btn btn-primary mt-6">
        Start Reporting →
      </Link>
    </div>

    {/* RIGHT SIDE: sample reports card */}
    <div className="sample-reports-card">
      <span className="sample-reports-title">SAMPLE REPORTS</span>

      <div className="report-item">
        <div className="report-item-top">
          <span className="report-item-name">Street Light Out</span>
          <span className="report-item-time">21:30</span>
        </div>
        <div className="rating-dots">
          <span className="dot filled caution"></span>
          <span className="dot filled caution"></span>
          <span className="dot filled caution"></span>
          <span className="dot filled caution"></span>
          <span className="dot"></span>
        </div>
        <p className="report-item-location">📍 Gulshan-2, Dhaka</p>
      </div>

      <div className="report-item">
        <div className="report-item-top">
          <span className="report-item-name">Theft</span>
          <span className="report-item-time">22:45</span>
        </div>
        <div className="rating-dots">
          <span className="dot filled danger"></span>
          <span className="dot filled danger"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
        <p className="report-item-location">📍 Banani DOHS, Dhaka</p>
      </div>

      <div className="report-item">
        <div className="report-item-top">
          <span className="report-item-name">Safe Area</span>
          <span className="report-item-time">09:00</span>
        </div>
        <div className="rating-dots">
          <span className="dot filled safe"></span>
          <span className="dot filled safe"></span>
          <span className="dot filled safe"></span>
          <span className="dot filled safe"></span>
          <span className="dot filled safe"></span>
        </div>
        <p className="report-item-location">📍 Dhanmondi 27, Dhaka</p>
      </div>

      <div className="report-item">
        <div className="report-item-top">
          <span className="report-item-name">Vandalism</span>
          <span className="report-item-time">18:15</span>
        </div>
        <div className="rating-dots">
          <span className="dot filled caution"></span>
          <span className="dot filled caution"></span>
          <span className="dot filled caution"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
        <p className="report-item-location">📍 Mirpur 10, Dhaka</p>
      </div>
    </div>
  </div>
</section>
      {/* SAFETY SCALE SECTION */}
      <section className="safety-scale-section">
        <div className="safety-scale-header">
          <span className="eyebrow">SAFETY SCALE</span>
          <h2>What do the colors mean?</h2>
        </div>

        <div className="safety-scale-grid">
          <div className="scale-card">
            <MapPin size={20} color="#3ecf8e" />
            <h3 className="scale-title safe">Safe <span>4–5 ★</span></h3>
            <p>Well-lit, regularly patrolled, community-confirmed safe zones.</p>
          </div>

          <div className="scale-card">
            <MapPin size={20} color="#f5a623" />
            <h3 className="scale-title caution">Caution <span>2–3 ★</span></h3>
            <p>Some reported incidents. Stay alert, especially at night.</p>
          </div>

          <div className="scale-card">
            <MapPin size={20} color="#ef4f4f" />
            <h3 className="scale-title danger">Danger <span>1 ★</span></h3>
            <p>Multiple serious incidents reported. Avoid if possible.</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <h2>Your neighbourhood needs your voice.</h2>
        <p>
          Join thousands of contributors mapping Bangladesh's streets one report at a time.
          Together, we make every elaka nirapod.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/register" className="btn btn-primary">
            Join the Community →
          </Link>
          <Link to="/map" className="btn btn-ghost">
            Explore the Map
          </Link>
        </div>
      </section>
    </div>
  );
}