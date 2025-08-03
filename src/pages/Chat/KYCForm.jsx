import React, { useState } from 'react';
import { FaIdCard, FaUserShield, FaGoogle, FaUpload, FaLock } from 'react-icons/fa';
import './KYC.css';

const KYCForm = ({ email, navigate, onSubmitted }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [driversLicense, setDriversLicense] = useState(null);
  const [ssc, setSSC] = useState(null);
  const [ssn, setSSN] = useState('');
  const [qr, setQr] = useState('');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [verified, setVerified] = useState(null);
  const [submitting, setSubmitting] = useState(false);

   const handleFile = (setter) => (e) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

   const getSetup = async () => {
    try {
      const res = await fetch(`http://localhost:5000/2fa/setup?email=${email}`);
      const data = await res.json();
      setQr(data.qr);
      setSecret(data.secret);
    } catch (err) {
      alert('Failed to generate 2FA setup. Make sure the backend is running.');
    }
  };

  const verifyToken = async () => {
    try {
      const res = await fetch('http://localhost:5000/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email }),
      });
      const data = await res.json();
      setVerified(data.verified);
    } catch (err) {
      alert('2FA verification failed. Check your backend connection.');
    }
  };


  const handleKYC = async (e) => {
    e.preventDefault();
    if (!verified) {
      alert('Please complete 2FA setup and verification.');
      return;
    }
    setSubmitting(true);

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('dob', dob);
    formData.append('address', address);
    formData.append('ssn', ssn);
    if (driversLicense) formData.append('driversLicense', driversLicense);
    if (ssc) formData.append('ssc', ssc);

    try {
      const res = await fetch('http://localhost:5000/kyc/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert('KYC and 2FA setup complete!');
        if (onSubmitted) onSubmitted();
      } else {
        alert('KYC submission failed: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error submitting KYC: ' + err.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="kyc-bg">
      <div className="kyc-card">
        <button
          className="back-btn"
          type="button"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>
        <h2>
          <FaUserShield style={{ color: "#007bff", marginRight: 8, verticalAlign: 'middle' }} />
          KYC Verification & 2FA Setup
        </h2>
        <form onSubmit={handleKYC} className="kyc-form" encType="multipart/form-data">
          <div className="kyc-row">
            <div className="input-group">
              <input required value={fullName} onChange={e => setFullName(e.target.value)} placeholder=" " />
              <label>full Name</label>
            </div>
            <div className="input-group">
              <input required type="email" value={email} disabled placeholder=" " />
              <label>Email</label>
            </div>
          </div>
          <div className="kyc-row">
            <div className="input-group">
              <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder=" " />
              <label>Phone</label>
            </div>
            <div className="input-group">
              <input required type="date" value={dob} onChange={e => setDob(e.target.value)} placeholder=" " />
              <label className="float-label">Date of Birth</label>
            </div>
          </div>
          <div className="input-group">
            <input required value={address} onChange={e => setAddress(e.target.value)} placeholder=" " />
            <label>Address</label>
          </div>
          <div className="kyc-row">
            <label className="file-label">
              <FaIdCard style={{ marginRight: 6, color: "#007bff" }} />
              Driver's License
              <input type="file" accept="image/*,.pdf" onChange={handleFile(setDriversLicense)} required />
              {driversLicense && <span className="file-name">{driversLicense.name}</span>}
              <FaUpload className="upload-icon" />
            </label>
            <label className="file-label">
              <FaIdCard style={{ marginRight: 6, color: "#28a745" }} />
              Social Security Card
              <input type="file" accept="image/*,.pdf" onChange={handleFile(setSSC)} required />
              {ssc && <span className="file-name">{ssc.name}</span>}
              <FaUpload className="upload-icon" />
            </label>
          </div>
          <div className="input-group">
            <input required value={ssn} onChange={e => setSSN(e.target.value.replace(/\D/g, '').slice(0, 9))} maxLength={9} placeholder=" " />
            <label>Social Security Number</label>
          </div>
          <hr className="kyc-divider" />
          <h3>
            <FaLock style={{ color: "#28a745", marginRight: 6, verticalAlign: 'middle' }} />
            Set Up 2FA
          </h3>
          {!qr ? (
            <button type="button" className="kyc-btn" onClick={getSetup}>
              <FaGoogle style={{ marginRight: 6 }} />
              Generate 2FA QR Code
            </button>
          ) : (
            <div className="twofa-section">
              <p className="twofa-instruct">Scan this QR code with <span style={{ color: "#007bff" }}>Google Authenticator</span> or <span style={{ color: "#28a745" }}>Authy</span>:</p>
              <img src={qr} alt="2FA QR" className="twofa-qr" />
              <p className="twofa-secret">Or enter this secret manually: <b style={{ color: "#007bff" }}>{secret}</b></p>
              <div className="twofa-input-row">
                <input
                  type="text"
                  value={token}
                  onChange={e => setToken(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  className="twofa-input"
                  required
                />
                <button type="button" className="kyc-btn" onClick={verifyToken}>Verify</button>
              </div>
              {verified === true && <div className="twofa-status success">✅ Verified!</div>}
              {verified === false && <div className="twofa-status error">❌ Invalid code</div>}
            </div>
          )}
          <hr className="kyc-divider" />
          <button type="submit" className="kyc-btn main-btn" disabled={!verified || submitting}>
            {submitting ? "Submitting..." : "Complete KYC & Enable 2FA"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default KYCForm;