import { Link } from 'react-router';
import { MapPin, Edit3, SlidersHorizontal, ChartNoAxesColumn, BadgeCheck, User } from 'lucide-react';
import './Landing.css';
export default function Landing() {
  return (
    <div>
      <section className="flex flex-col items-center text-center px-6 py-24 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Know Your Area. Stay Safe.
        </h1>
        <p className="opacity-70 mb-8">
          Nirapod Elaka is Bangladesh's community-powered safety platform.
          Report incidents, explore live safety ratings, and help build safer neighborhoods — together.
        </p>
        <div className="flex gap-3">
          <Link to="/register" className="btn btn-primary">
            Get Started — It's Free
          </Link>
          <Link to="/map" className="btn btn-ghost">
            Explore the Live Map
          </Link>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-6 py-16">
  <h2 className="text-2xl font-bold text-center mb-10">
    Everything you need to stay informed
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="card bg-[var(--color-surface)] p-6">
      <h3 className="font-semibold mb-2">Live Safety Map</h3>
      <p className="opacity-70 text-sm">
        Color-coded pins on an interactive map. Green, amber, and red at a glance.
      </p>

      
    </div>
  </div>
</section>

  <section className= "features-section">
    <div className="features-header">
    <span className="eyebrow">FEATURES</span>
    <h2>Everything you need to stay informed</h2>
    <p>A complete safety intelligence platform built by the community, for the community.</p>
    </div>

    <div className="features-grid">
     <Link to="" className="feature-card hover-green">
            <div className="icon-badge green">
              <MapPin size={22} color="#34d399" />
            </div>
            <h3>Live Safety Map</h3>
            <p>Color-coded pins on an interactive OpenStreetMap. Green, amber, and red at a glance — no jargon, no guesswork.</p>
       </Link>
          <Link to=""  className="feature-card hover-amber">
            <div className="icon-badge amber">
              <Edit3 size={22} color="#e0a340" />
            </div>
            <h3>Reporting</h3>
            <p>File a report with a single click. Your identity is stored privately — the public only sees the safety data.</p>
          </Link>

            <Link to=""  className="feature-card hover-violet">
            <div className="icon-badge violet">
              <SlidersHorizontal size={22} color="#8b7af5" />
            </div>
            <h3>Smart Filters</h3>
            <p>Filter by time of day (morning, afternoon, night) and incident type to find exactly the data you care about.</p>
          </Link>


           <Link to=""  className="feature-card hover-sky">
            <div className="icon-badge sky">
              <ChartNoAxesColumn size={22} color="#60a5fa" />
            </div>
            <h3>Community Impact</h3>
            <p>Public stats page shows total reports, contributors, average safety ratings, incident breakdowns, and top flagged zones.</p>
          </Link> 

          <Link to=""  className="feature-card hover-rose">
            <div className="icon-badge rose">
              <BadgeCheck size={22} color="#f45e5e" />
            </div>
            <h3>Community Moderation</h3>
            <p>Users can flag false or misleading reports. Admins review a queue to keep the data clean and trustworthy.</p>
          </Link>

          <Link to=""  className="feature-card hover-amber">
            <div className="icon-badge amber">
              <User size={22} color="#e0a340" />
            </div>
            <h3>Personal History</h3>
            <p>Track, edit, or delete your own reports from a private dashboard. Full control over your contributions.</p>
          </Link>        
    </div>
  
  </section>
  
    </div>  
  );
}