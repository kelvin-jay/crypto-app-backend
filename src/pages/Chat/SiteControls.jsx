import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "./SiteControls.css"; // Assuming you have a CSS file for styling

const SiteControls = () => {
  const [announcement, setAnnouncement] = useState("");
  const [siteMode, setSiteMode] = useState("live");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const db = firebase.database();
    db.ref("global_announcement").once("value", snap => {
      setAnnouncement(snap.val()?.text || "");
    });
    db.ref("site_mode").once("value", snap => {
      setSiteMode(snap.val() || "live");
    });
  }, []);

  const handleSaveAnnouncement = async () => {
    const db = firebase.database();
    await db.ref("global_announcement").set({
      text: announcement,
      timestamp: Date.now(),
    });
    setMsg("Announcement updated!");
    setTimeout(() => setMsg(""), 1500);
  };

  const handleToggleSiteMode = async () => {
    const db = firebase.database();
    const newMode = siteMode === "live" ? "maintenance" : "live";
    await db.ref("site_mode").set(newMode);
    setSiteMode(newMode);
    setMsg(`Site mode set to ${newMode}`);
    setTimeout(() => setMsg(""), 1500);
  };

  return (
    <div className="site-controls-panel">
      <h2>Site Controls</h2>
      <div style={{ marginBottom: 16 }}>
        <label>
          <b>Global Announcement:</b>
          <input
            type="text"
            value={announcement}
            onChange={e => setAnnouncement(e.target.value)}
            style={{ width: 350, marginLeft: 8 }}
          />
        </label>
        <button onClick={handleSaveAnnouncement} style={{ marginLeft: 8 }}>
          Save
        </button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <b>Site Mode:</b>
        <button onClick={handleToggleSiteMode} style={{ marginLeft: 8 }}>
          {siteMode === "live" ? "Set Maintenance Mode" : "Set Live Mode"}
        </button>
        <span style={{ marginLeft: 10, color: siteMode === "live" ? "#28a745" : "#dc3545" }}>
          {siteMode === "live" ? "LIVE" : "MAINTENANCE"}
        </span>
      </div>
      {msg && <div style={{ color: "#28a745", marginTop: 10 }}>{msg}</div>}
    </div>
  );
};

export default SiteControls;