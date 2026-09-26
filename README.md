# Nirapod Elaka (নিরাপদ এলাকা)

**Nirapod Elaka** ("Safe Area" in Bengali) is a crowdsourced, community-powered public safety platform for Bangladesh. It lets people report incidents on an interactive map, browse live safety ratings for their neighbourhood, and help build a safer community together.

## Features

- **Live Safety Map** — Color-coded incident markers (safe / caution / danger) on an interactive OpenStreetMap/Leaflet map, with search/geocoding support.
- **Incident Reporting** — Submit a report with type (theft, harassment, accident, suspicious activity, no incident), time of day, a 0–5 safety rating, description, and location.
- **Community Feed** — Browse approved reports, search/filter by safety status, like reports, and comment on them.
- **Personal Dashboard (Profile)** — View, edit, and delete your own reports; track their moderation status; change your password.
- **Admin Panel** — Manage users (promote/demote/delete), view platform stats, and moderate reports (approve, reject, send back for review).
- **Moderation Queue** — Community-flagged reports go through a review workflow (pending → resolved/dismissed).
- **Notifications** — In-app notification bell for report status changes and admin alerts on new submissions.
- **Auth** — Register, login, forgot/reset password, and change password, secured with JWT and bcrypt-hashed passwords.
- **Carbon Footprint Tracking** — Estimates the CO₂ impact of network data transferred during a session (`@tgwf/co2`).

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router
- Tailwind CSS + DaisyUI
- Leaflet / React-Leaflet + Leaflet Control Geocoder
- Axios
- Lucide React (icons)

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JSON Web Tokens (JWT) for auth
- bcryptjs for password hashing
- CORS, dotenv

## Project Structure

```
├── src/                      # Frontend (React + Vite)
│   ├── components/           # Navbar, Footer, NotificationBell, CarbonFootprintDisplay, etc.
│   ├── pages/                # Landing, Map, Community, Login, Signup, Profile, Admin, etc.
│   └── main.jsx / App.jsx
├── backend/                  # Backend (Express + MongoDB)
│   ├── models/                # User, Report, Comment, Flag, Notification
│   ├── controllers/           # auth, report, comment, admin, moderation, notification
│   ├── routes/                 # authRoutes, reportRoutes, adminRoutes, etc.
│   ├── middleware/             # authMiddleware (protect, adminOnly)
│   ├── utils/                  # notifyReportStatus
│   └── server.js
└── package.json
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB connection string (local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/Farhana7361/Nirapod_Elaka.git
cd Nirapod_Elaka
```

### 2. Install dependencies
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 3. Configure environment variables
Create a `.env` file inside the `backend/` folder:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 4. Run the app
```bash
# Start the backend (from /backend)
npm start

# Start the frontend (from project root, in a separate terminal)
npm run dev
```

The frontend will be available at `http://localhost:5173` (Vite default) and the backend API at `http://localhost:5000`.

### 5. Build for production
```bash
npm run build
```
The Express server (`server.js`) serves the built frontend from the `dist/` folder and exposes the API under `/api`.

## API Overview

| Base Route | Description |
|---|---|
| `/api/auth` | Register, login, check-email, reset/change password |
| `/api/reports` | Create, list, update, delete reports; like; comments |
| `/api/comments` | Delete a comment |
| `/api/moderation` | Approve/reject reports, resolve/dismiss flags (admin only) |
| `/api/admin` | Platform stats, user management, report status updates (admin only) |
| `/api/notifications` | Get, mark-as-read, mark-all-as-read |

Authenticated routes require an `Authorization: Bearer <token>` header. Admin-only routes additionally require the user's role to be `admin`.

## License

ISC