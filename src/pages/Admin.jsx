import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  Users,
  Shield,
  FileText,
  Trash2,
  Search,
  UserCheck,
  UserX,
  RefreshCw,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  MapPin,
} from "lucide-react";
import axios from "axios";
import "./Admin.css";

export default function Admin() {
  const navigate = useNavigate();
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'users' | 'reports'

  // Data states
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Notification / Alert
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [userToDelete, setUserToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Initial reports list (for administration / moderation)
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setCurrentAdmin(u);
      } catch (e) {
        console.error(e);
      }
    }
    fetchAdminData();
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const [statsRes, usersRes, reportsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/stats", getAuthHeader()),
        axios.get("http://localhost:5000/api/admin/users", getAuthHeader()),
        axios.get("http://localhost:5000/api/admin/reports", getAuthHeader()),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setReports(reportsRes.data);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const showNotification = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: "", message: "" });
    }, 4000);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setActionLoading(true);
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/users/${userToDelete._id}`,
        getAuthHeader(),
      );
      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
      showNotification(
        "success",
        `User "${userToDelete.name}" has been removed.`,
      );
      setUserToDelete(null);
      // Refresh stats
      fetchAdminData();
    } catch (err) {
      console.error("Delete user error:", err);
      showNotification(
        "error",
        err.response?.data?.message || "Failed to delete user",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleRole = async (targetUser) => {
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    setActionLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${targetUser._id}/role`,
        { role: newRole },
        getAuthHeader(),
      );
      setUsers((prev) =>
        prev.map((u) =>
          u._id === targetUser._id ? { ...u, role: newRole } : u,
        ),
      );
      showNotification(
        "success",
        `Role for "${targetUser.name}" changed to ${newRole.toUpperCase()}.`,
      );
      fetchAdminData();
    } catch (err) {
      console.error("Update role error:", err);
      showNotification(
        "error",
        err.response?.data?.message || "Failed to update role",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateReportStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin/reports/${id}/status`,
        { status },
        getAuthHeader(),
      );
      setReports((prev) =>
        prev.map((r) =>
          r._id === id
            ? { ...r, status: res.data.report.status, reviewNote: res.data.report.reviewNote }
            : r
        )
      );
      showNotification("success", `Report marked as "${status}".`);
    } catch (err) {
      console.error("Update report status error:", err);
      showNotification(
        "error",
        err.response?.data?.message || "Failed to update report status",
      );
    }
  }; 

  // Filter users by search query and role
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.identity?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "all" ? true : (u.role || "user") === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="admin-page">
      {/* Top Admin Navbar */}

      {/* Main Container */}
      <main className="admin-main">
        {/* Tab Navigation & Refresh */}
        <div className="tab-bar-row">
          <div className="tab-bar">
            <button
              onClick={() => setActiveTab("overview")}
              className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
            >
              <Shield size={16} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
            >
              <Users size={16} />
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`tab-btn ${activeTab === "reports" ? "active" : ""}`}
            >
              <FileText size={16} />
              Reports ({reports.length})
            </button>
          </div>

          <button
            onClick={fetchAdminData}
            disabled={isLoading}
            className="refresh-btn"
          >
            <RefreshCw size={15} className={isLoading ? "spin" : ""} />
            <span>{isLoading ? "Refreshing..." : "Refresh Data"}</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="overview-section">
            {/* Stat Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-card-label">Total Citizens</span>
                  <div className="stat-icon stat-icon-blue">
                    <Users size={16} />
                  </div>
                </div>
                <div className="stat-value">
                  {stats?.stats?.totalUsers ?? users.length}
                </div>
                <p className="stat-sub stat-sub-green">
                  ↑ Registered active accounts
                </p>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-card-label">Administrators</span>
                  <div className="stat-icon stat-icon-amber">
                    <Shield size={16} />
                  </div>
                </div>
                <div className="stat-value stat-value-amber">
                  {stats?.stats?.totalAdmins ??
                    users.filter((u) => u.role === "admin").length}
                </div>
                <p className="stat-sub">Full management permissions</p>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-card-label">Community Reports</span>
                  <div className="stat-icon stat-icon-purple">
                    <FileText size={16} />
                  </div>
                </div>
                <div className="stat-value">
                  {stats?.stats?.totalReports ?? 1248}
                </div>
                <p className="stat-sub stat-sub-amber">
                  {reports.length} pending moderation
                </p>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-card-label">Safe Zones</span>
                  <div className="stat-icon stat-icon-emerald">
                    <MapPin size={16} />
                  </div>
                </div>
                <div className="stat-value stat-value-emerald">
                  {stats?.stats?.safeAreasCount ?? 486}
                </div>
                <p className="stat-sub">Community verified safety zones</p>
              </div>
            </div>

            {/* Breakdown & Recent Quick View */}

            {/* Quick Actions & System Info */}
            <div className="shortcuts-card">
              <div className="shortcuts-header">
                <h3 className="shortcuts-title">
                  <ShieldAlert size={18} className="icon-amber" />
                  Quick Administrative Shortcuts
                </h3>
              </div>

              <div className="shortcuts-grid">
                <button
                  onClick={() => setActiveTab("users")}
                  className="shortcut-btn"
                >
                  <div className="shortcut-btn-title">
                    <span>Manage Registered Users</span>
                    <span>→</span>
                  </div>
                  <p className="shortcut-btn-desc">
                    Search, inspect accounts, change administrator roles, or
                    delete users.
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab("reports")}
                  className="shortcut-btn"
                >
                  <div className="shortcut-btn-title">
                    <span>Review Safety Reports</span>
                    <span>→</span>
                  </div>
                  <p className="shortcut-btn-desc">
                    Moderate user incident reports and check community alerts.
                  </p>
                </button>
              </div>

              <div className="security-notice">
                <span className="security-notice-icon">🛡️</span>
                <div>
                  <strong>Admin Security Notice:</strong> All administrative
                  changes (user removals, permission elevations) take effect
                  immediately across all client sessions.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS MANAGEMENT */}
        {activeTab === "users" && (
          <div className="panel">
            {/* Table Controls */}
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Registered Users</h2>
                <p className="panel-subtitle">
                  Showing {filteredUsers.length} of {users.length} total
                  registered accounts
                </p>
              </div>

              <div className="panel-controls">
                {/* Search */}
                <div className="search-wrap">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email..."
                    className="search-input"
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="role-select"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Citizens Only</option>
                  <option value="admin">Admins Only</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Identity / Role</th>
                    <th>Account Status</th>
                    <th>Joined Date</th>
                    <th className="col-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u._id}>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">
                              {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div>
                              <div className="user-name-row">
                                {u.name}
                                {u._id === currentAdmin?._id && (
                                  <span className="you-badge">(You)</span>
                                )}
                              </div>
                              <div className="user-email">{u.email}</div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="identity-badge">
                            {u.identity || "Citizen"}
                          </span>
                        </td>

                        <td>
                          {u.role === "admin" ? (
                            <span className="role-badge role-badge-admin">
                              <Shield size={12} />
                              Admin
                            </span>
                          ) : (
                            <span className="role-badge role-badge-citizen">
                              Citizen
                            </span>
                          )}
                        </td>

                        <td className="joined-date">
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )
                            : "N/A"}
                        </td>

                        <td className="col-right">
                          <div className="actions-cell">
                            {/* Toggle role button */}
                            {u._id !== currentAdmin?._id && (
                              <button
                                onClick={() => handleToggleRole(u)}
                                title={
                                  u.role === "admin"
                                    ? "Demote to Citizen"
                                    : "Promote to Admin"
                                }
                                className="icon-btn"
                              >
                                {u.role === "admin" ? (
                                  <UserX size={15} />
                                ) : (
                                  <UserCheck size={15} />
                                )}
                              </button>
                            )}

                            {/* Delete button */}
                            {u._id !== currentAdmin?._id && (
                              <button
                                onClick={() => setUserToDelete(u)}
                                title="Delete user"
                                className="icon-btn icon-btn-delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="empty-row">
                        No users found matching the filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SAFETY REPORTS */}
        {activeTab === "reports" && (
          <div className="panel">
            <div className="panel-header panel-header-reports">
              <div>
                <h2 className="panel-title">Safety Reports Moderation</h2>
                <p className="panel-subtitle">
                  Review and moderate community-submitted incidents
                </p>
              </div>
              <span className="active-records-badge">
                {reports.length} Active Records
              </span>
            </div>

            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Incident Type</th>
                    <th>Location</th>
                    <th>Reported By</th>
                    <th>Severity</th>
                    <th className="col-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report._id}>
                      <td>
                        <div className="report-type">{report.type}</div>
                        <div className="report-desc" title={report.description}>
                          {report.description}
                        </div>
                      </td>

                      <td className="report-location">
                        📍{" "}
                        {report.address ||
                          `${report.location?.lat}, ${report.location?.lng}`}
                      </td>

                      <td>
                        <div className="report-reporter">
                          {report.reportedBy?.name || "Unknown"}
                        </div>
                        <div className="report-time">
                          {new Date(report.createdAt).toLocaleString()}
                        </div>
                      </td>

                      <td>
                        <span
                          className={`severity-badge severity-${report.status}`}
                        >
                          <span className="severity-dot"></span>
                          {report.status}
                        </span>
                      </td>

                      <td className="col-right">
                        <div className="report-actions-cell">
                          <button
                            onClick={() =>
                              handleUpdateReportStatus(report._id, "approved")
                            }
                            className="accept-btn"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateReportStatus(report._id, "review")
                            }
                            className="review-btn"
                          >
                            Review
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <div className="modal-icon">
                <Trash2 size={20} />
              </div>
              <h3 className="modal-title">Confirm User Deletion</h3>
            </div>

            <p className="modal-text">
              Are you sure you want to delete the user{" "}
              <strong>"{userToDelete.name}"</strong> (
              <span className="modal-text-email">{userToDelete.email}</span>)?
              This action is permanent and cannot be undone.
            </p>

            <div className="modal-actions">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                disabled={actionLoading}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={actionLoading}
                className="btn-delete-confirm"
              >
                {actionLoading ? "Deleting..." : "Yes, Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
