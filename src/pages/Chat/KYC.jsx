import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import KYCStatus from './KYCStatus';
import KYCForm from './KYCForm';
import './KYC.css';

const KYC = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const email = user?.email;

  const [kycData, setKycData] = useState(null);
  const [checking, setChecking] = useState(true);

  // Check KYC status on mount and when email changes
  useEffect(() => {
    if (!email) {
      setChecking(false);
      return;
    }
    setChecking(true);
    fetch(`http://localhost:4243/kyc/status/${encodeURIComponent(email)}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setKycData(data);
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [email]);

  // Show loading while checking
  if (checking) return <div className="kyc-bg"><div className="kyc-card">Loading...</div></div>;

  // If KYC exists and is not rejected, show status card
 // Show status card for any KYC record
  if (kycData && kycData.kycStatus) {
    return (
      <div className="kyc-bg">
        <KYCStatus
          userEmail={email}
          onResubmit={() => setKycData(null)}
        />
      </div>
    );
  }
  // Otherwise, show the KYC form
  return (
    <KYCForm
      email={email}
      navigate={navigate}
      onSubmitted={() => {
        // After submission, re-fetch KYC status to show status card
        setChecking(true);
        fetch(`http://localhost:4243/kyc/status/${encodeURIComponent(email)}`)
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            setKycData(data);
            setChecking(false);
          })
          .catch(() => setChecking(false));
      }}
    />
  );
};

export default KYC;