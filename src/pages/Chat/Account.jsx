import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "./Account.css";

const accountFeatures = [
  { key: "profile", label: "Profile", icon: "fas fa-user" },
  { key: "security", label: "Security", icon: "fas fa-lock" },
  { key: "kyc", label: "KYC Verification", icon: "fas fa-id-card" },
  { key: "transactions", label: "Transactions", icon: "fas fa-exchange-alt" },
  { key: "notifications", label: "Notifications", icon: "fas fa-bell" },
  { key: "settings", label: "Settings", icon: "fas fa-cog" },
];

export default function Account() {
  const navigate = useNavigate();
  const [active, setActive] = useState("profile");
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState(null);

  // Listen for auth state
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((fbUser) => {
      setFirebaseUser(fbUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch profile info when firebaseUser is available
  useEffect(() => {
    if (!firebaseUser) {
      setLoading(false);
      return;
    }
    setLoading(true);
    firebase
      .database()
      .ref(`users/${firebaseUser.uid}/profile`)
      .once("value", (snap) => {
        setUser(snap.val() || {
          name: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          phone: firebaseUser.phoneNumber || "",
          address: "",
        });
        setEditData(snap.val() || {
          name: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          phone: firebaseUser.phoneNumber || "",
          address: "",
        });
        setLoading(false);
      });
  }, [firebaseUser]);

  const handleSave = () => {
    if (!firebaseUser) return;
    firebase
      .database()
      .ref(`users/${firebaseUser.uid}/profile`)
      .set(editData)
      .then(() => {
        setUser(editData);
        setEdit(false);
        setMsg("Profile updated!");
        setTimeout(() => setMsg(""), 1800);
      });
  };

  if (loading) {
    return (
      <div className="account-container">
        <div style={{ textAlign: "center", padding: "2em" }}>
          <span className="loader"></span> Loading profile...
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div className="account-container">
        <div style={{ textAlign: "center", padding: "2em", color: "#dc3545" }}>
          You are not logged in.
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="account-container">
        <div style={{ textAlign: "center", padding: "2em", color: "#dc3545" }}>
          Unable to load profile information.
        </div>
      </div>
    );
  }

  return (
    <div className="account-container">
      <button
        className="back-to-dashboard-btn"
        onClick={() => navigate("/dashboard")}
      >
        <i className="fas fa-arrow-left"></i> Back to Dashboard
      </button>
      <h2 className="account-title">My Account</h2>
      <div className="account-features-menu">
        {accountFeatures.map((f) => (
          <button
            key={f.key}
            className={`account-feature-btn${active === f.key ? " active" : ""}`}
            onClick={() => setActive(f.key)}
          >
            <i className={f.icon}></i>
            <span>{f.label}</span>
          </button>
        ))}
      </div>
      <div className="account-feature-content">
        {active === "profile" && (
          <div>
            <h3>Profile Information</h3>
            {!edit ? (
              <div className="account-info-list">
                <div><b>Name:</b> {user.name}</div>
                <div><b>Email:</b> {user.email}</div>
                <div><b>Phone:</b> {user.phone}</div>
                <div><b>Address:</b> {user.address}</div>
                <button className="account-edit-btn" onClick={() => { setEdit(true); setEditData(user); }}>
                  Edit Profile
                </button>
                {msg && <div className="account-success-msg">{msg}</div>}
              </div>
            ) : (
              <div className="account-info-list">
                <label>
                  Name:
                  <input
                    type="text"
                    value={editData.name || ""}
                    onChange={e => setEditData(d => ({ ...d, name: e.target.value }))}
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    value={editData.email || ""}
                    onChange={e => setEditData(d => ({ ...d, email: e.target.value }))}
                  />
                </label>
                <label>
                  Phone:
                  <input
                    type="text"
                    value={editData.phone || ""}
                    onChange={e => setEditData(d => ({ ...d, phone: e.target.value }))}
                  />
                </label>
                <label>
                  Address:
                  <input
                    type="text"
                    value={editData.address || ""}
                    onChange={e => setEditData(d => ({ ...d, address: e.target.value }))}
                  />
                </label>
                <div style={{ marginTop: 16 }}>
                  <button className="account-save-btn" onClick={handleSave}>Save</button>
                  <button className="account-cancel-btn" onClick={() => setEdit(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}
        {active === "kyc" && (
          <div>
            <h3>KYC Verification</h3>
            <div className="account-info-list">
              <div>
                <b>Status:</b> <span className={`kyc-status ${(user.kycStatus || "unknown").toLowerCase()}`}>
  {user.kycStatus || "Unknown"}
</span>
              </div>
              <button className="account-edit-btn" style={{ marginTop: 12 }}>
                {user.kycStatus === "Verified" ? "View KYC" : "Start KYC"}
              </button>
            </div>
          </div>
        )}
        {active === "transactions" && (
          <div>
            <h3>Recent Transactions</h3>
            <div className="account-info-list">
              <div>No transactions found.</div>
            </div>
          </div>
        )}
        {active === "notifications" && (
          <div>
            <h3>Notifications</h3>
            <div className="account-info-list">
              <div>No notifications yet.</div>
            </div>
          </div>
        )}
        {active === "settings" && (
          <div>
            <h3>Settings</h3>
            <div className="account-info-list">
              <div>Theme: <span>Light</span></div>
              <div>Language: <span>English</span></div>
              <button className="account-edit-btn" style={{ marginTop: 12 }}>Edit Settings</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
