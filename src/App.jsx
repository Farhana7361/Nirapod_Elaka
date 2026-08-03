import { Routes, Route } from 'react-router';
import Navbar from './components/Navbar.jsx';
import Landing from './pages/Landing.jsx';
import Footer from './components/Footer.jsx';
export default function App() {
  return (
  <div className="app-shell">
    <Navbar />
    <Routes>
      <Route path="/" element={<Landing />} />
    </Routes>
    <Footer />
  </div>
);
}