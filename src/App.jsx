import { Routes, Route } from 'react-router';
import Navbar from './components/Navbar.jsx';
import Landing from './pages/Landing.jsx';
import Map from './pages/Map.jsx';
import Community from './pages/Community.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import MyReports from './pages/MyReports.jsx';
import Profile from './pages/Profile.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/map" element={<Map />} />
        <Route path="/community" element={<Community />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/myreports" element={<MyReports />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      <Footer />
    </div>
  );
}