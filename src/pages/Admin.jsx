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
  MapPin,
  ExternalLink,
  ShieldAlert,
  ArrowUpDown
} from "lucide-react";
import axios from "axios";

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
  const [reports, setReports] = useState([
    {
      id: 1,
      type: "Theft",
      location: "Banani DOHS, Dhaka",
      time: "2 hours ago",
      status: "Danger",
      reporter: "Rahim Ahmed",
      description: "A theft was reported near the main road. Residents are advised to stay alert.",
    },
    {
      id: 2,
      type: "Street Light Problem",
      location: "Mirpur 10, Dhaka",
      time: "5 hours ago",
      status: "Caution",
      reporter: "Farhana Rahman",
      description: "Several street lights are not working properly, making the area darker at night.",
    },
    {
      id: 3,
      type: "Vandalism",
      location: "Gulshan-2, Dhaka",
      time: "8 hours ago",
      status: "Caution",
      reporter: "Tanvir Hasan",
      description: "Property damage was reported near a public area. The community has been notified.",
    },
    {
      id: 4,
      type: "Safe Area",
      location: "Dhanmondi 27, Dhaka",
      time: "Yesterday",
      status: "Safe",
      reporter: "Nabila Karim",
      description: "This area has good lighting and regular community activity, making it relatively safe.",
    },
    {
      id: 5,
      type: "Suspicious Activity",
      location: "Mohammadpur, Dhaka",
      time: "Yesterday",
      status: "Danger",
      reporter: "Saiful Islam",
      description: "Residents reported suspicious activity in the area during the evening.",
    },
  ]);

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

      const [statsRes, usersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/stats", getAuthHeader()),
        axios.get("http://localhost:5000/api/admin/users", getAuthHeader()),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
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
        getAuthHeader()
      );
      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
      showNotification("success", `User "${userToDelete.name}" has been removed.`);
      setUserToDelete(null);
      // Refresh stats
      fetchAdminData();
    } catch (err) {
      console.error("Delete user error:", err);
      showNotification(
        "error",
        err.response?.data?.message || "Failed to delete user"
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
        getAuthHeader()
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u))
      );
      showNotification(
        "success",
        `Role for "${targetUser.name}" changed to ${newRole.toUpperCase()}.`
      );
      fetchAdminData();
    } catch (err) {
      console.error("Update role error:", err);
      showNotification(
        "error",
        err.response?.data?.message || "Failed to update role"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteReport = (id) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    showNotification("success", "Safety report dismissed/deleted successfully.");
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
    <div className="min-h-screen bg-[#0d111a] text-[#e9ecf3]">
      {/* Top Admin Navbar */}
      <header className="bg-[#141924] border-b border-[#242c3d] sticky top-0 z-40 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[#f5a623] font-bold">
              <Shield size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-lg tracking-tight">
                  Nirapod Elaka
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  Admin Panel
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c2333] hover:bg-[#252e42] text-xs text-[#9aa4ba] hover:text-white border border-[#2b354a] transition"
            >
              <ExternalLink size={13} />
              View Site
            </Link>

            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-[#242c3d] text-xs text-[#9aa4ba]">
              <span>Signed in as:</span>
              <span className="font-semibold text-white">
                {currentAdmin?.name || "Admin"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition cursor-pointer"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Toast Feedback */}
        {feedback.message && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center justify-between text-sm shadow-lg ${
              feedback.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedback.type === "success" ? (
                <CheckCircle2 size={18} />
              ) : (
                <AlertTriangle size={18} />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback({ type: "", message: "" })}
              className="text-xs opacity-70 hover:opacity-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Navigation & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 bg-[#141924] p-1.5 rounded-xl border border-[#242c3d]">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === "overview"
                  ? "bg-[#f5a623] text-[#0d111a]"
                  : "text-[#9aa4ba] hover:text-white"
              }`}
            >
              <Shield size={16} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === "users"
                  ? "bg-[#f5a623] text-[#0d111a]"
                  : "text-[#9aa4ba] hover:text-white"
              }`}
            >
              <Users size={16} />
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === "reports"
                  ? "bg-[#f5a623] text-[#0d111a]"
                  : "text-[#9aa4ba] hover:text-white"
              }`}
            >
              <FileText size={16} />
              Reports ({reports.length})
            </button>
          </div>

          <button
            onClick={fetchAdminData}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#171d2b] hover:bg-[#20283b] text-sm text-[#9aa4ba] hover:text-white border border-[#2b354a] rounded-xl transition cursor-pointer disabled:opacity-50 self-start sm:self-auto"
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin text-amber-400" : ""} />
            <span>{isLoading ? "Refreshing..." : "Refresh Data"}</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#141924] border border-[#242c3d] rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center justify-between text-[#8e98ac] mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Citizens</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Users size={16} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stats?.stats?.totalUsers ?? users.length}
                </div>
                <p className="text-xs text-[#3ecf8e] flex items-center gap-1 font-medium">
                  ↑ Registered active accounts
                </p>
              </div>

              <div className="bg-[#141924] border border-[#242c3d] rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center justify-between text-[#8e98ac] mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Administrators</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Shield size={16} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-amber-400 mb-1">
                  {stats?.stats?.totalAdmins ?? users.filter((u) => u.role === "admin").length}
                </div>
                <p className="text-xs text-[#9aa4ba]">
                  Full management permissions
                </p>
              </div>

              <div className="bg-[#141924] border border-[#242c3d] rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center justify-between text-[#8e98ac] mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Community Reports</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <FileText size={16} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stats?.stats?.totalReports ?? 1248}
                </div>
                <p className="text-xs text-amber-400">
                  {reports.length} pending moderation
                </p>
              </div>

              <div className="bg-[#141924] border border-[#242c3d] rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center justify-between text-[#8e98ac] mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Safe Zones</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <MapPin size={16} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-emerald-400 mb-1">
                  {stats?.stats?.safeAreasCount ?? 486}
                </div>
                <p className="text-xs text-[#9aa4ba]">
                  Community verified safety zones
                </p>
              </div>
            </div>

            {/* Breakdown & Recent Quick View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Identity Distribution */}
              <div className="bg-[#141924] border border-[#242c3d] rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Users size={18} className="text-amber-400" />
                  User Demographics
                </h3>
                <div className="space-y-3">
                  {stats?.identityBreakdown && stats.identityBreakdown.length > 0 ? (
                    stats.identityBreakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#0e121a] border border-[#202736]"
                      >
                        <span className="text-sm text-[#cbd5e1] font-medium">
                          {item._id || "Not specified"}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
                          {item.count} users
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-[#7e889b] text-center py-6">
                      No demographic breakdown available yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions & System Info */}
              <div className="lg:col-span-2 bg-[#141924] border border-[#242c3d] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldAlert size={18} className="text-amber-400" />
                    Quick Administrative Shortcuts
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab("users")}
                    className="p-4 rounded-xl bg-[#0e121a] hover:bg-[#181f2e] border border-[#202736] hover:border-amber-500/40 text-left transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-white font-semibold text-sm mb-1 group-hover:text-amber-400">
                      <span>Manage Registered Users</span>
                      <span>→</span>
                    </div>
                    <p className="text-xs text-[#7e889b]">
                      Search, inspect accounts, change administrator roles, or delete users.
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveTab("reports")}
                    className="p-4 rounded-xl bg-[#0e121a] hover:bg-[#181f2e] border border-[#202736] hover:border-amber-500/40 text-left transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-white font-semibold text-sm mb-1 group-hover:text-amber-400">
                      <span>Review Safety Reports</span>
                      <span>→</span>
                    </div>
                    <p className="text-xs text-[#7e889b]">
                      Moderate user incident reports and check community alerts.
                    </p>
                  </button>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-[#9aa4ba] flex items-start gap-3">
                  <span className="text-amber-400 text-base shrink-0">🛡️</span>
                  <div>
                    <strong className="text-white">Admin Security Notice:</strong> All administrative changes (user removals, permission elevations) take effect immediately across all client sessions.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS MANAGEMENT */}
        {activeTab === "users" && (
          <div className="bg-[#141924] border border-[#242c3d] rounded-2xl overflow-hidden shadow-xl">
            {/* Table Controls */}
            <div className="p-5 border-b border-[#242c3d] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Registered Users</h2>
                <p className="text-xs text-[#8e98ac]">
                  Showing {filteredUsers.length} of {users.length} total registered accounts
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5c677d]"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email..."
                    className="bg-[#0e121a] border border-[#283244] focus:border-amber-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#5c677d] outline-none w-56 sm:w-64"
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-[#0e121a] border border-[#283244] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Citizens Only</option>
                  <option value="admin">Admins Only</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0e121a] border-b border-[#242c3d] text-[11px] font-semibold uppercase tracking-wider text-[#7e889b]">
                    <th className="py-3.5 px-5">User</th>
                    <th className="py-3.5 px-5">Identity / Role</th>
                    <th className="py-3.5 px-5">Account Status</th>
                    <th className="py-3.5 px-5">Joined Date</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2535] text-sm">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-[#181f2e]/60 transition">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#f5a623] font-bold text-xs shrink-0">
                              {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div>
                              <div className="font-semibold text-white flex items-center gap-1.5">
                                {u.name}
                                {u._id === currentAdmin?._id && (
                                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-medium">
                                    (You)
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-[#7e889b]">{u.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-md text-xs bg-[#1f2738] text-[#9aa4ba] border border-[#2b364d]">
                              {u.identity || "Citizen"}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          {u.role === "admin" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                              <Shield size={12} />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-300 border border-slate-500/20">
                              Citizen
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-5 text-xs text-[#8e98ac]">
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "N/A"}
                        </td>

                        <td className="py-4 px-5 text-right">
                          <div className="inline-flex items-center gap-2">
                            {/* Toggle role button */}
                            {u._id !== currentAdmin?._id && (
                              <button
                                onClick={() => handleToggleRole(u)}
                                title={
                                  u.role === "admin"
                                    ? "Demote to Citizen"
                                    : "Promote to Admin"
                                }
                                className="p-2 rounded-lg bg-[#1f2738] hover:bg-[#283248] text-[#9aa4ba] hover:text-amber-400 border border-[#2b364d] transition cursor-pointer"
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
                                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition cursor-pointer"
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
                      <td colSpan="5" className="py-8 text-center text-xs text-[#7e889b]">
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
          <div className="bg-[#141924] border border-[#242c3d] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-[#242c3d] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Safety Reports Moderation</h2>
                <p className="text-xs text-[#8e98ac]">
                  Review and moderate community-submitted incidents
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {reports.length} Active Records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0e121a] border-b border-[#242c3d] text-[11px] font-semibold uppercase tracking-wider text-[#7e889b]">
                    <th className="py-3.5 px-5">Incident Type</th>
                    <th className="py-3.5 px-5">Location</th>
                    <th className="py-3.5 px-5">Reported By</th>
                    <th className="py-3.5 px-5">Severity</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2535] text-sm">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-[#181f2e]/60 transition">
                      <td className="py-4 px-5">
                        <div className="font-semibold text-white">{report.type}</div>
                        <div className="text-xs text-[#7e889b] max-w-xs truncate">
                          {report.description}
                        </div>
                      </td>

                      <td className="py-4 px-5 text-xs text-[#9aa4ba]">
                        📍 {report.location}
                      </td>

                      <td className="py-4 px-5">
                        <div className="text-xs font-medium text-white">{report.reporter}</div>
                        <div className="text-[11px] text-[#7e889b]">{report.time}</div>
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            report.status === "Safe"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : report.status === "Caution"
                              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                              : "bg-red-500/15 text-red-400 border border-red-500/30"
                          }`}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor:
                                report.status === "Safe"
                                  ? "#3ecf8e"
                                  : report.status === "Caution"
                                  ? "#f5a623"
                                  : "#ef4f4f",
                            }}
                          ></span>
                          {report.status}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition cursor-pointer"
                        >
                          Dismiss / Delete
                        </button>
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#161c28] border border-[#2a3449] rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
                <Trash2 size={20} />
              </div>
              <h3 className="text-lg font-bold text-white">Confirm User Deletion</h3>
            </div>

            <p className="text-sm text-[#9aa4ba] mb-6">
              Are you sure you want to delete the user{" "}
              <strong className="text-white">"{userToDelete.name}"</strong> (
              <span className="text-amber-400">{userToDelete.email}</span>)? This action is permanent and cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-[#1f2738] hover:bg-[#283248] text-sm text-[#cbd5e1] font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-sm text-white font-semibold transition cursor-pointer disabled:opacity-50"
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
