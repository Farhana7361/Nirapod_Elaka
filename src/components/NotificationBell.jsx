import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
}

function typeColor(type) {
  if (type === "approved") return "#3ecf8e";
  if (type === "rejected") return "#ef4f4f";
  return "#f5a623";
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  const token = localStorage.getItem("token");

  const fetchNotifications = useCallback(async () => {
    const t = localStorage.getItem("token");
    if (!t) return;

    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/notifications`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error("Fetch notifications error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount, then poll every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkRead = async (notification) => {
    if (notification.isRead) return;

    // Update the UI right away, then sync with the server
    setNotifications((prev) =>
      prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await axios.put(
        `${API_BASE}/notifications/${notification._id}/read`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
    } catch (err) {
      console.error("Mark read error:", err);
      fetchNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await axios.put(
        `${API_BASE}/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
    } catch (err) {
      console.error("Mark all read error:", err);
      fetchNotifications();
    }
  };

  // Not logged in: show nothing
  if (!token) return null;

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => {
          setOpen((prev) => !prev);
          if (!open) fetchNotifications();
        }}
        className="relative p-2 rounded-lg text-[#e9ecf3] hover:bg-[#1f2838] transition"
        aria-label="Notifications"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#ef4f4f] text-white text-[11px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-[#171e2c] border border-[#2b3548] rounded-xl shadow-xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2b3548]">
            <p className="font-semibold text-[#e9ecf3]">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-[#f5a623] hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && notifications.length === 0 && (
              <p className="text-[#68738a] text-sm px-4 py-6 text-center">Loading...</p>
            )}

            {!loading && notifications.length === 0 && (
              <p className="text-[#68738a] text-sm px-4 py-6 text-center">
                No notifications yet.
              </p>
            )}

            {notifications.map((n) => (
              <button
                key={n._id}
                onClick={() => handleMarkRead(n)}
                className={`w-full text-left px-4 py-3 border-b border-[#2b3548] last:border-b-0 hover:bg-[#1f2838] transition flex gap-3 ${
                  n.isRead ? "opacity-60" : ""
                }`}
              >
                <span
                  className="mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: n.isRead ? "#2b3548" : typeColor(n.type) }}
                ></span>
                <span className="flex-1">
                  <span className="block text-sm text-[#e9ecf3] break-words">
                    {n.message}
                  </span>
                  <span className="block text-xs text-[#68738a] mt-1">
                    {timeAgo(n.createdAt)}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}