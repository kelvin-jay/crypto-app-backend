import React, { useEffect, useState } from "react";
import "./AdminKYC.css";

const ADMIN_API_KEY = "your-very-secret-admin-key"; // Use env variable in production!

const statusColors = {
  pending: "#ffc107",
  verified: "#28a745",
  rejected: "#dc3545",
};

const AdminKYC = () => {
  const [kycList, setKycList] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [search, setSearch] = useState("");
  const [noteInput, setNoteInput] = useState({});
  const [actionLoading, setActionLoading] = useState({});

  // Fetch all KYC submissions
  const fetchKYCList = async () => {
    const res = await fetch("http://localhost:5000/admin/kyc/all", {
      headers: {
        "x-admin-key": ADMIN_API_KEY,
      },
    });
    return res.json();
  };

  useEffect(() => {
    fetchKYCList().then((data) => {
      setKycList(data);
      setLoading(false);
    });
  }, []);

  // Approve or reject KYC
  const handleKYCAction = async (email, status) => {
    setActionLoading((prev) => ({ ...prev, [email]: true }));
    const message =
      status === "rejected"
        ? prompt("Enter rejection reason:")
        : "Your KYC has been verified!";
    await fetch("http://localhost:5000/admin/kyc/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": ADMIN_API_KEY,
      },
      body: JSON.stringify({ email, status, message }),
    });
    setKycList(await fetchKYCList());
    setActionLoading((prev) => ({ ...prev, [email]: false }));
  };

  // Save admin note
  const handleNoteSave = async (email) => {
    await fetch("http://localhost:5000/admin/kyc/note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": ADMIN_API_KEY,
      },
      body: JSON.stringify({ email, note: noteInput[email] }),
    });
    setKycList(await fetchKYCList());
    setNoteInput((prev) => ({ ...prev, [email]: "" }));
  };

  // Delete KYC record and files
  const handleDelete = async (email) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this KYC submission?"
      )
    ) {
      await fetch("http://localhost:5000/admin/kyc/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": ADMIN_API_KEY,
        },
        body: JSON.stringify({ email }),
      });
      setKycList(await fetchKYCList());
    }
  };

  const filtered = Object.values(kycList).filter(
    (kyc) =>
      kyc.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      kyc.email?.toLowerCase().includes(search.toLowerCase()) ||
      kyc.kycStatus?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="kyc-admin-outer">
      <h2 className="kyc-admin-title">KYC Submissions</h2>
      <input
        className="kyc-admin-search"
        placeholder="Search by name, email, or status..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading ? (
        <div className="kyc-admin-loading">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="kyc-admin-empty">No KYC submissions found.</div>
      ) : (
        filtered.map((kyc) => (
          <div
            key={kyc.email}
            className={`kyc-admin-card ${
              expanded[kyc.email] ? "expanded" : ""
            }`}
          >
            <div
              className="kyc-admin-card-header"
              onClick={() =>
                setExpanded((prev) => ({
                  ...prev,
                  [kyc.email]: !prev[kyc.email],
                }))
              }
            >
              <div>
                <span className="kyc-admin-name">{kyc.fullName}</span>
                <span className="kyc-admin-email">&lt;{kyc.email}&gt;</span>
              </div>
              <span
                className="kyc-admin-status"
                style={{
                  background: statusColors[kyc.kycStatus] || "#888",
                  color: "#fff",
                }}
              >
                {kyc.kycStatus}
              </span>
            </div>
            {expanded[kyc.email] && (
              <div className="kyc-admin-card-body">
                <div className="kyc-admin-fields">
                  <div>
                    <b>Phone:</b> {kyc.phone}
                  </div>
                  <div>
                    <b>DOB:</b> {kyc.dob}
                  </div>
                  <div>
                    <b>Address:</b> {kyc.address}
                  </div>
                  <div>
                    <b>SSN:</b> {kyc.ssn}
                  </div>
                  <div>
                    <b>Submitted:</b>{" "}
                    {kyc.date && new Date(kyc.date).toLocaleString()}
                  </div>
                </div>
                <div className="kyc-admin-docs">
                  <div>
                    <b>Driver's License:</b>{" "}
                    {kyc.driversLicenseFile ? (
                      /\.(jpg|jpeg|png|gif)$/i.test(kyc.driversLicenseFile) ? (
                        <img
                          src={`http://localhost:5000/${kyc.driversLicenseFile.replace(
                            /\\/g,
                            "/"
                          )}`}
                          alt="Driver's License"
                          className="kyc-admin-doc-img"
                        />
                      ) : (
                        <a
                          href={`http://localhost:5000/${kyc.driversLicenseFile.replace(
                            /\\/g,
                            "/"
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View PDF
                        </a>
                      )
                    ) : (
                      <span style={{ color: "#888" }}>Not uploaded</span>
                    )}
                  </div>
                  <div>
                    <b>Social Security Card:</b>{" "}
                    {kyc.sscFile ? (
                      /\.(jpg|jpeg|png|gif)$/i.test(kyc.sscFile) ? (
                        <img
                          src={`http://localhost:5000/${kyc.sscFile.replace(
                            /\\/g,
                            "/"
                          )}`}
                          alt="SSC"
                          className="kyc-admin-doc-img"
                        />
                      ) : (
                        <a
                          href={`http://localhost:5000/${kyc.sscFile.replace(
                            /\\/g,
                            "/"
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View PDF
                        </a>
                      )
                    ) : (
                      <span style={{ color: "#888" }}>Not uploaded</span>
                    )}
                  </div>
                </div>
                <div className="kyc-admin-actions">
                  {kyc.kycStatus === "pending" && (
                    <>
                      <button
                        className="kyc-admin-btn verify"
                        disabled={actionLoading[kyc.email]}
                        onClick={() => handleKYCAction(kyc.email, "verified")}
                      >
                        {actionLoading[kyc.email] ? "Processing..." : "Verify"}
                      </button>
                      <button
                        className="kyc-admin-btn reject"
                        disabled={actionLoading[kyc.email]}
                        onClick={() => handleKYCAction(kyc.email, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {kyc.kycStatus !== "pending" && (
                    <span>
                      <b>Admin Message:</b> {kyc.kycMessage}
                      {kyc.kycStatus === "rejected" && (
                        <button
                          className="kyc-admin-btn reject"
                          style={{ background: "#6c757d", marginLeft: 10 }}
                          onClick={() => handleDelete(kyc.email)}
                        >
                          Delete
                        </button>
                      )}
                    </span>
                  )}
                </div>
                <div className="kyc-admin-note">
                  <b>Admin Note:</b>{" "}
                  <span style={{ color: "#007bff" }}>
                    {kyc.adminNote || "None"}
                  </span>
                  <div style={{ marginTop: 6 }}>
                    <input
                      className="kyc-admin-note-input"
                      placeholder="Add note..."
                      value={noteInput[kyc.email] || ""}
                      onChange={(e) =>
                        setNoteInput((prev) => ({
                          ...prev,
                          [kyc.email]: e.target.value,
                        }))
                      }
                    />
                    <button
                      className="kyc-admin-btn note"
                      onClick={() => handleNoteSave(kyc.email)}
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminKYC;