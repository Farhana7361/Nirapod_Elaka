import { NavLink } from 'react-router';

export default function Navbar() {
  return (
    <nav className="navbar bg-base-100 shadow-sm px-6">
      <div className="flex-1 flex items-center gap-2">
  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_theme(colors.amber.400)]"></span>
  <span className="text-xl font-bold">Nirapod Elaka</span>
</div>
      <div className="flex gap-2">
        <NavLink to="/map" className="btn btn-ghost">Map</NavLink>
        <NavLink to="/stats" className="btn btn-ghost">Community</NavLink>
        <NavLink to="/login" className="btn btn-ghost">Log in</NavLink>
        <NavLink to="/register" className="btn btn-primary">Sign up</NavLink>
      </div>
    </nav>
  );
}