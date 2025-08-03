import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaRedo, FaDownload, FaFileAlt } from "react-icons/fa";
import "./KYCStatus.css";

const statusInfo = {
  pending: {
    icon: <FaHourglassHalf color="#ffc107" size={22} />,
    label: "Pending Review",
    color: "#ffc107",
    desc: "Your KYC submission is under review. Please check back soon.",
  },
  verified: {
    icon: <FaCheckCircle color="#28a745" size={22} />,
    label: "Verified",
    color: "#28a745",
    desc: "Congratulations! Your identity has been verified. You now have full access.",
  },
  rejected: {
    icon: <FaTimesCircle color="#dc3545" size={22} />,
    label: "Rejected",
    color: "#dc3545",
    desc: "Unfortunately, your KYC was rejected. Please review the message below and resubmit.",
  },
};

const KYCStatus = ({ userEmail, onResubmit }) => {
  const params = useParams();
  const navigate = useNavigate();
  const email = userEmail || params.email;
  const [kyc, setKyc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) {
      setError("No email provided.");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`http://localhost:5000/kyc/status/${encodeURIComponent(email)}`)
      .then(res => {
        if (!res.ok) throw new Error('No KYC found');
        return res.json();
      })
      .then(data => {
        setKyc(data && !data.error ? data : null);
        setError(data && data.error ? data.error : "");
        setLoading(false);
      })
      .catch(() => {
        setError("No KYC found.");
        setLoading(false);
      });
  }, [email]);

  const handleDownload = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) return <div className="kyc-status-card">Loading...</div>;
  if (error || !kyc)
    return (
      <div className="kyc-status-card">
        <FaTimesCircle color="#dc3545" size={32} style={{ marginBottom: 8 }} />
        <div style={{ color: "#dc3545", fontWeight: 600, marginBottom: 12 }}>
          {error || "No KYC record found."}
        </div>
        <button className="kyc-btn" onClick={() => navigate("/kyc")}>
          Submit KYC
        </button>
      </div>
    );

  const status = statusInfo[kyc.kycStatus] || statusInfo.pending;

  return (
    <div className="kyc-status-card advanced">
      <div className="kyc-status-header">
        {status.icon}
        <span
          className="kyc-status-label"
          style={{ color: status.color, marginLeft: 10, fontWeight: 700, fontSize: "1.2em" }}
        >
          {status.label}
        </span>
      </div>
      <div className="kyc-status-desc">{status.desc}</div>
      <div className="kyc-status-details">
        <div>
          <b>Full Name:</b> {kyc.fullName}
        </div>
        <div>
          <b>Email:</b> {kyc.email}
        </div>
        <div>
          <b>Phone:</b> {kyc.phone}
        </div>
        <div>
          <b>Date of Birth:</b> {kyc.dob}
        </div>
        <div>
          <b>Address:</b> {kyc.address}
        </div>
        <div>
          <b>SSN:</b> <span className="blurred">{kyc.ssn}</span>
        </div>
        <div>
          <b>Submitted:</b> {kyc.date && new Date(kyc.date).toLocaleString()}
        </div>
      </div>
      <div className="kyc-status-docs">
        <div>
          <FaFileAlt style={{ marginRight: 6, color: "#007bff" }} />
          <b>Driver's License:</b>
          {kyc.driversLicenseFile ? (
            <button
              className="kyc-doc-btn"
              onClick={() =>
                handleDownload(
                  `http://localhost:5000/${kyc.driversLicenseFile.replace(/\\/g, "/")}`
                )
              }
            >
              <FaDownload style={{ marginRight: 4 }} />
              View / Download
            </button>
          ) : (
            <span className="kyc-doc-missing">Not uploaded</span>
          )}
        </div>
        <div>
          <FaFileAlt style={{ marginRight: 6, color: "#28a745" }} />
          <b>Social Security Card:</b>
          {kyc.sscFile ? (
            <button
              className="kyc-doc-btn"
              onClick={() =>
                handleDownload(
                  `http://localhost:5000/${kyc.sscFile.replace(/\\/g, "/")}`
                )
              }
            >
              <FaDownload style={{ marginRight: 4 }} />
              View / Download
            </button>
          ) : (
            <span className="kyc-doc-missing">Not uploaded</span>
          )}
        </div>
      </div>
      {kyc.kycMessage && (
        <div
          className="kyc-status-message"
          style={{
            color: kyc.kycStatus === "rejected" ? "#dc3545" : "#007bff",
            background: kyc.kycStatus === "rejected" ? "#f8d7da" : "#e9f7fe",
            borderRadius: 8,
            padding: "0.8em 1em",
            margin: "1.1em 0 0.5em 0",
            fontWeight: 500,
          }}
        >
          <b>Admin Message:</b> {kyc.kycMessage}
        </div>
      )}
      <div className="kyc-status-actions">
         {kyc.kycStatus === "rejected" && (
    <button
      className="kyc-btn"
      onClick={() => onResubmit ? onResubmit() : navigate("/kyc")}
      style={{ marginRight: 10 }}
    >
      <FaRedo style={{ marginRight: 6 }} />
      Resubmit KYC
    </button>
  )}
        <button className="kyc-btn outline" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default KYCStatus;