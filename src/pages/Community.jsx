import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

const API_BASE = "http://localhost:5000/api";

// Derive a Safe / Caution / Danger badge from the numeric rating stored on the report
function getStatus(rating) {
  if (rating >= 4) return "Safe";
  if (rating === 3) return "Caution";
  return "Danger";
}

function statusColor(status) {
  if (status === "Safe") return "#3ecf8e";
  if (status === "Caution") return "#f5a623";
  return "#ef4f4f";
}

// Turn a createdAt timestamp into a friendly "2 hours ago" style string
function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(dateString).toLocaleDateString();
}

export default function Community() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Reports");

  // Which report IDs currently have their comment panel open
  const [openComments, setOpenComments] = useState({});
  // comments keyed by reportId
  const [commentsByReport, setCommentsByReport] = useState({});
  const [commentLoading, setCommentLoading] = useState({});
  // current text typed into each report's comment box, keyed by reportId
  const [commentDrafts, setCommentDrafts] = useState({});

  // Tracks which reports have a comment POST in flight (state for UI, ref for instant guard)
  const [commentPosting, setCommentPosting] = useState({});
  const commentPostingRef = useRef({});

  // Tracks which comments are currently being deleted, keyed by commentId
  const [commentDeleting, setCommentDeleting] = useState({});
  const commentDeletingRef = useRef({});

  const [currentUser, setCurrentUser] = useState(null);

  // Same pattern for likes: state for UI, ref for instant guard
  const [likeLoading, setLikeLoading] = useState({});
  const likeLoadingRef = useRef({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch {
        setCurrentUser(null);
      }
    }
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await axios.get(`${API_BASE}/reports/approved`);
      setReports(res.data);
    } catch (err) {
      console.error("Fetch reports error:", err);
      setErrorMsg("Couldn't load reports. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const getToken = () => localStorage.getItem("token");

  const handleLike = async (reportId) => {
    // Block if a like request for this report is already in flight
    if (likeLoadingRef.current[reportId]) return;

    const token = getToken();
    if (!token) {
      setErrorMsg("Please log in to like a report.");
      return;
    }

    likeLoadingRef.current[reportId] = true;
    setLikeLoading((prev) => ({ ...prev, [reportId]: true }));
    try {
      const res = await axios.put(
        `${API_BASE}/reports/${reportId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReports((prev) =>
        prev.map((r) =>
          r._id === reportId ? { ...r, likes: res.data.likes } : r
        )
      );
    } catch (err) {
      console.error("Like error:", err);
      if (err.response?.status === 401) {
        setErrorMsg("Your session expired. Please log in again.");
      } else {
        setErrorMsg("Couldn't update like. Please try again.");
      }
    } finally {
      likeLoadingRef.current[reportId] = false;
      setLikeLoading((prev) => ({ ...prev, [reportId]: false }));
    }
  };

  const toggleComments = async (reportId) => {
    const isOpen = !!openComments[reportId];
    setOpenComments((prev) => ({ ...prev, [reportId]: !isOpen }));

    // Fetch comments the first time this panel is opened
    if (!isOpen && !commentsByReport[reportId]) {
      setCommentLoading((prev) => ({ ...prev, [reportId]: true }));
      try {
        const res = await axios.get(`${API_BASE}/reports/${reportId}/comments`);
        setCommentsByReport((prev) => ({ ...prev, [reportId]: res.data }));
      } catch (err) {
        console.error("Fetch comments error:", err);
        setCommentsByReport((prev) => ({ ...prev, [reportId]: [] }));
      } finally {
        setCommentLoading((prev) => ({ ...prev, [reportId]: false }));
      }
    }
  };

  const handleCommentSubmit = async (reportId, e) => {
    e.preventDefault();

    // Block if a post for this report is already in flight
    if (commentPostingRef.current[reportId]) return;

    const token = getToken();
    if (!token) {
      setErrorMsg("Please log in to comment.");
      return;
    }

    const text = (commentDrafts[reportId] || "").trim();
    if (!text) return;

    commentPostingRef.current[reportId] = true;
    setCommentPosting((prev) => ({ ...prev, [reportId]: true }));

    try {
      const res = await axios.post(
        `${API_BASE}/reports/${reportId}/comments`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommentsByReport((prev) => ({
        ...prev,
        [reportId]: [...(prev[reportId] || []), res.data],
      }));
      setCommentDrafts((prev) => ({ ...prev, [reportId]: "" }));
    } catch (err) {
      console.error("Post comment error:", err);
      setErrorMsg("Couldn't post your comment. Please try again.");
    } finally {
      commentPostingRef.current[reportId] = false;
      setCommentPosting((prev) => ({ ...prev, [reportId]: false }));
    }
  };

  const handleDeleteComment = async (reportId, commentId) => {
    // Block if this comment is already being deleted
    if (commentDeletingRef.current[commentId]) return;

    const token = getToken();
    if (!token) {
      setErrorMsg("Please log in to delete a comment.");
      return;
    }

    if (!window.confirm("Delete this comment?")) return;

    commentDeletingRef.current[commentId] = true;
    setCommentDeleting((prev) => ({ ...prev, [commentId]: true }));

    try {
      await axios.delete(`${API_BASE}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCommentsByReport((prev) => ({
        ...prev,
        [reportId]: (prev[reportId] || []).filter((c) => c._id !== commentId),
      }));
    } catch (err) {
      console.error("Delete comment error:", err);
      if (err.response?.status === 403) {
        setErrorMsg("You can only delete your own comments.");
      } else if (err.response?.status === 404) {
        // Already gone on the server, so remove it from the UI too
        setCommentsByReport((prev) => ({
          ...prev,
          [reportId]: (prev[reportId] || []).filter((c) => c._id !== commentId),
        }));
      } else if (err.response?.status === 401) {
        setErrorMsg("Your session expired. Please log in again.");
      } else {
        setErrorMsg("Couldn't delete your comment. Please try again.");
      }
    } finally {
      commentDeletingRef.current[commentId] = false;
      setCommentDeleting((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  // Apply search text + status filter, most recent first (backend already sorts by createdAt desc)
  const filteredReports = reports.filter((r) => {
    const status = getStatus(r.rating);

    if (activeFilter !== "All Reports" && activeFilter !== "Recent" && activeFilter !== status) {
      return false;
    }

    if (searchText.trim()) {
      const haystack = `${r.type} ${r.description} ${r.address}`.toLowerCase();
      if (!haystack.includes(searchText.trim().toLowerCase())) return false;
    }

    return true;
  });

  const totalReports = reports.length;
  const safeCount = reports.filter((r) => getStatus(r.rating) === "Safe").length;
  const contributorCount = new Set(
    reports.map((r) => r.reportedBy?._id).filter(Boolean)
  ).size;

  const filters = ["All Reports", "Safe", "Caution", "Danger", "Recent"];

  return (
    <div className="min-h-screen bg-[#10151f] text-[#e9ecf3] px-6 pt-24 pb-16">
      <div className="max-w-6xl mx-auto">

        {/* PAGE HEADER */}
        <div className="text-center mb-10">
          <p className="text-[#f5a623] text-sm font-semibold tracking-widest mb-3">
            COMMUNITY
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Community Safety Reports
          </h1>
          <p className="text-[#9aa4ba] max-w-2xl mx-auto">
            See what people around the community are reporting and help make
            your neighbourhood safer.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center bg-[#171e2c] border border-[#2b3548] rounded-xl px-4 py-3">
              <span className="text-xl mr-3">🔍</span>
              <input
                type="text"
                placeholder="Search reports, locations or incidents..."
                className="w-full bg-transparent outline-none text-[#e9ecf3] placeholder:text-[#68738a]"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* FILTER BUTTONS */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={
                activeFilter === f
                  ? "px-4 py-2 rounded-lg bg-[#f5a623] text-[#10151f] font-semibold"
                  : "px-4 py-2 rounded-lg bg-[#171e2c] border border-[#2b3548] text-[#9aa4ba] hover:text-[#e9ecf3]"
              }
            >
              {f}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="max-w-3xl mx-auto mb-8 text-center text-[#ef4f4f] bg-[#2a1a1a] border border-[#4a2a2a] rounded-xl py-3 px-4">
            {errorMsg}
          </div>
        )}

        {/* STATISTICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <div className="bg-[#171e2c] border border-[#2b3548] rounded-2xl p-6">
            <p className="text-[#9aa4ba] text-sm mb-2">Total Reports</p>
            <h2 className="text-4xl font-bold text-[#e9ecf3]">{totalReports}</h2>
          </div>

          <div className="bg-[#171e2c] border border-[#2b3548] rounded-2xl p-6">
            <p className="text-[#9aa4ba] text-sm mb-2">Safe Areas</p>
            <h2 className="text-4xl font-bold text-[#3ecf8e]">{safeCount}</h2>
            <p className="text-[#9aa4ba] text-sm mt-2">Community confirmed</p>
          </div>

          <div className="bg-[#171e2c] border border-[#2b3548] rounded-2xl p-6">
            <p className="text-[#9aa4ba] text-sm mb-2">Active Contributors</p>
            <h2 className="text-4xl font-bold text-[#f5a623]">{contributorCount}</h2>
            <p className="text-[#9aa4ba] text-sm mt-2">Helping their communities</p>
          </div>
        </div>

        {/* RECENT REPORTS TITLE */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <p className="text-[#f5a623] text-sm font-semibold tracking-widest mb-2">
                RECENT ACTIVITY
              </p>
              <h2 className="text-3xl font-bold">Community Reports</h2>
            </div>
            <p className="text-[#68738a] text-sm">
              {loading ? "Loading..." : `Showing ${filteredReports.length} report${filteredReports.length === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>

        {/* REPORT CARDS */}
        {!loading && filteredReports.length === 0 && (
          <p className="text-center text-[#68738a] py-10">
            No reports match your search or filter yet.
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredReports.map((report) => {
            const status = getStatus(report.rating);
            const color = statusColor(status);
            const isLiked = currentUser && report.likes?.includes(currentUser._id);
            const commentsOpen = !!openComments[report._id];
            const comments = commentsByReport[report._id] || [];
            const isPosting = !!commentPosting[report._id];
            const draft = commentDrafts[report._id] || "";

            return (
              <div
                key={report._id}
                className="bg-[#171e2c] border border-[#2b3548] rounded-2xl p-6 hover:border-[#f5a623] transition"
              >
                {/* REPORT TOP */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      ></span>
                      <h3 className="text-xl font-bold">{report.type}</h3>
                    </div>
                    <p className="text-[#9aa4ba] text-sm">📍 {report.address}</p>
                    {report.reportedBy?.name && (
                      <p className="text-[#68738a] text-xs mt-1">
                        Reported by {report.reportedBy.name}
                      </p>
                    )}
                  </div>
                  <span className="text-[#68738a] text-sm whitespace-nowrap">
                    {timeAgo(report.createdAt)}
                  </span>
                </div>

                {/* REPORT DESCRIPTION */}
                <p className="text-[#9aa4ba] leading-6 mb-5 break-words">{report.description}</p>

                {/* REPORT BOTTOM */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-[#2b3548] pt-4">
                  <div>
                    <p className="text-sm font-semibold" style={{ color }}>
                      {status}
                    </p>
                    <p className="text-lg tracking-widest" style={{ color }}>
                      {"★".repeat(report.rating)}
                      {"☆".repeat(5 - report.rating)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleLike(report._id)}
                      disabled={likeLoading[report._id]}
                      className={
                        isLiked
                          ? "px-4 py-2 rounded-lg border border-[#f5a623] text-[#f5a623] bg-[#2a2210] transition flex items-center gap-2"
                          : "px-4 py-2 rounded-lg border border-[#2b3548] text-[#e9ecf3] hover:bg-[#1f2838] transition flex items-center gap-2"
                      }
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill={isLiked ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
                      </svg>
                      {report.likes?.length || 0}
                    </button>

                    <button
                      onClick={() => toggleComments(report._id)}
                      className="px-4 py-2 rounded-lg border border-[#2b3548] text-[#e9ecf3] hover:bg-[#1f2838] transition"
                    >
                      💬 {commentsOpen ? "Hide" : "Comments"}
                    </button>
                  </div>
                </div>

                {/* COMMENTS PANEL */}
                {commentsOpen && (
                  <div className="mt-4 border-t border-[#2b3548] pt-4">
                    {commentLoading[report._id] && (
                      <p className="text-[#68738a] text-sm">Loading comments...</p>
                    )}

                    {!commentLoading[report._id] && comments.length === 0 && (
                      <p className="text-[#68738a] text-sm mb-3">
                        No comments yet. Be the first to say something.
                      </p>
                    )}

                    <div className="space-y-3 mb-4 max-h-56 overflow-y-auto pr-1">
                      {comments.map((c) => {
                        const canDelete =
                          currentUser &&
                          (c.user?._id === currentUser._id ||
                            currentUser.role === "admin");

                        return (
                          <div key={c._id} className="bg-[#12151f] rounded-lg p-3">
                            <div className="flex items-start justify-between gap-3 mb-1">
                              <p className="text-[#e9ecf3] text-sm font-semibold">
                                {c.user?.name || "User"}
                              </p>
                              {canDelete && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteComment(report._id, c._id)}
                                  disabled={!!commentDeleting[c._id]}
                                  className="text-xs text-[#ef4f4f] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {commentDeleting[c._id] ? "Deleting..." : "Delete"}
                                </button>
                              )}
                            </div>
                            <p className="text-[#9aa4ba] text-sm break-words">{c.text}</p>
                          </div>
                        );
                      })}
                    </div>

                    {currentUser ? (
                      <form
                        onSubmit={(e) => handleCommentSubmit(report._id, e)}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          maxLength={500}
                          value={draft}
                          disabled={isPosting}
                          onChange={(e) =>
                            setCommentDrafts((prev) => ({
                              ...prev,
                              [report._id]: e.target.value,
                            }))
                          }
                          className="flex-1 bg-[#12151f] border border-[#2c3242] rounded-lg px-3 py-2 text-sm text-[#e9ecf3] outline-none focus:border-[#e6a94f] disabled:opacity-60"
                        />
                        <button
                          type="submit"
                          disabled={isPosting || !draft.trim()}
                          className="px-4 py-2 rounded-lg bg-[#f5a623] text-[#10151f] font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isPosting ? "Posting..." : "Post"}
                        </button>
                      </form>
                    ) : (
                      <p className="text-[#68738a] text-sm">
                        <NavLink to="/login" className="text-[#f5a623] hover:underline">
                          Log in
                        </NavLink>{" "}
                        to leave a comment.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* BOTTOM CTA */}
        <div className="mt-12 bg-[#171e2c] border border-[#2b3548] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Help make your neighbourhood safer.
          </h2>
          <p className="text-[#9aa4ba] mb-6 max-w-xl mx-auto">
            Share what you see around you and help other people make safer
            decisions.
          </p>
          <NavLink
            to={currentUser ? "/map" : "/login"}
            className="inline-block px-6 py-3 rounded-lg bg-[#f5a623] text-[#10151f] font-bold hover:opacity-90 transition"
          >
            Start Reporting →
          </NavLink>
        </div>

      </div>
    </div>
  );
}