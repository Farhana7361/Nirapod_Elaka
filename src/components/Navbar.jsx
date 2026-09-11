import { NavLink, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { User, Menu, X } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `btn btn-ghost ${isActive ? "btn-active" : ""}`;

  const mobileLinkClass = ({ isActive }) =>
    `btn btn-ghost justify-start w-full ${isActive ? "btn-active" : ""}`;

  const isAdmin = user?.role === "admin";

  return (
    <nav className="navbar fixed top-0 left-0 w-full z-50 bg-base-100 shadow-sm px-6 flex-col items-stretch">
      <div className="flex items-center justify-between w-full">
        <div className="flex-1 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_theme(colors.amber.400)]"></span>
          <NavLink to="/" className="text-xl font-bold">Nirapod Elaka</NavLink>
        </div>

        {/* Desktop links */}
        <div className="hidden lg:flex gap-2 items-center">
          {!user && <NavLink to="/" className={linkClass}>Home</NavLink>}
          {!isAdmin && <NavLink to="/map" className={linkClass}>Map</NavLink>}
          {!isAdmin && <NavLink to="/community" className={linkClass}>Community</NavLink>}

          {user ? (
            <>
              <NavLink to={isAdmin ? "/admin" : "/profile"} className={({ isActive }) => `btn btn-ghost flex items-center gap-2 ${isActive ? "btn-active" : ""}`}>
                <User size={18} />
                {user.name.split(" ")[0]}
              </NavLink>
              <button onClick={handleLogout} className="btn btn-primary">Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Log in</NavLink>
              <NavLink to="/signup" className="btn btn-primary">Sign up</NavLink>
            </>
          )}
        </div>

        {/* Mobile hamburger button */}
        <button
          className="lg:hidden btn btn-ghost btn-square"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="lg:hidden flex flex-col gap-1 py-3 w-full">
          {!user && <NavLink to="/" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>}
          {!isAdmin && <NavLink to="/map" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Map</NavLink>}
          {!isAdmin && <NavLink to="/community" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Community</NavLink>}

          {user ? (
            <>
              <NavLink to="/profile" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
                <User size={18} className="inline mr-2" />
                {user.name.split(" ")[0]}
              </NavLink>
              <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="btn btn-primary w-full">Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>Log in</NavLink>
              <NavLink to="/signup" className="btn btn-primary w-full" onClick={() => setMenuOpen(false)}>Sign up</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}