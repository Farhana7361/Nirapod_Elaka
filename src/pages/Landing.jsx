import { Link } from 'react-router';

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
    </div>
  );
}