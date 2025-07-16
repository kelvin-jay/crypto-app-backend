import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { db } from "./firebase";
import ChatAdminPanel from "./ChatAdminPanel";
import AdminKYC from "./AdminKYC";
import UserManagement from "./UserManagement";
import SiteControls from "./SiteControls";
import "./AdminDashboard.css";

const SIDEBAR_ITEMS = [
  { key: "chat", label: "Chat Support", icon: "fas fa-comments" },
  { key: "kyc", label: "KYC Verification", icon: "fas fa-id-card" },
  { key: "users", label: "User Management", icon: "fas fa-users" },
  { key: "site", label: "Site Controls", icon: "fas fa-cogs" },
];

function AdminDashboard() { 
  // State variables
  const [authUser, setAuthUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState('light');

  // Listen for auth state changes
  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setAuthUser(user);
      setAdmin(false);
      setError("");
      if (user) {
        // Check if user is admin in your database
        const snap = await db.ref(`users/${user.uid}/role`).once("value");
        if (snap.val() === "admin") setAdmin(true);
        else setError("You are not an admin.");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
    } catch (err) {
      setError("Login failed: " + err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(getAuth());
    setAuthUser(null);
    setAdmin(false);
    setEmail("");
    setPassword("");
  };

  if (!authUser || !admin) {
    return (
      <div className="admin-login-bg">
        <div className="admin-login-box">
          <h2 className="admin-login-title">Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Admin email"
              className="admin-login-input"
              required
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="admin-login-input"
              required
            />
            <button type="submit" className="admin-login-btn">
              Login
            </button>
          </form>
          {error && <div style={{ color: "#dc3545", marginTop: 12 }}>{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
        <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className={`theme-toggle-btn ${theme}`}
      >
        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>
      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="admin-sidebar-header">
          <span className="admin-logo">Admin</span>
          <button
            className="admin-sidebar-toggle"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle Sidebar"
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
        <nav className="admin-sidebar-nav">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.key}
              className={`admin-sidebar-link${activeTab === item.key ? " active" : ""}`}
              onClick={() => {
                setActiveTab(item.key);
                setSidebarOpen(false);
              }}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button className="admin-logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* Main Content */}
      <main className="admin-main-content ${theme}">
        <header className="admin-main-header">
          <button
            className="admin-sidebar-toggle mobile"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open Sidebar"
          >
            <i className="fas fa-bars"></i>
          </button>
          <h1>
            {SIDEBAR_ITEMS.find(i => i.key === activeTab)?.label || "Admin"}
          </h1>
        </header>
        <section className="admin-panel-content">
          {activeTab === "chat" && <ChatAdminPanel />}
          {activeTab === "kyc" && <AdminKYC />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "site" && <SiteControls />}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;