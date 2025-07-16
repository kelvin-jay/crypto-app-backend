import React, { useState } from 'react';

const Setup2FA = () => {
  const [qr, setQr] = useState('');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [verified, setVerified] = useState(null);

  const getSetup = async () => {
    const res = await fetch('http://localhost:4243/2fa/setup');
    const data = await res.json();
    setQr(data.qr);
    setSecret(data.secret);
  };

  const verifyToken = async () => {
    const res = await fetch('http://localhost:4243/2fa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    setVerified(data.verified);
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 12 }}>
      <h2>Set Up 2FA</h2>
      {!qr ? (
        <button onClick={getSetup}>Generate 2FA QR Code</button>
      ) : (
        <>
          <p>Scan this QR code with Google Authenticator or Authy:</p>
          <img src={qr} alt="2FA QR" style={{ width: 200, height: 200 }} />
          <p>Or enter this secret manually: <b>{secret}</b></p>
          <hr />
          <p>Enter the 6-digit code from your app:</p>
          <input
            type="text"
            value={token}
            onChange={e => setToken(e.target.value.replace(/\D/g, ''))}
            maxLength={6}
            style={{ fontSize: 18, letterSpacing: 4, width: 120 }}
          />
          <button onClick={verifyToken} style={{ marginLeft: 12 }}>Verify</button>
          {verified === true && <div style={{ color: 'green', marginTop: 10 }}>✅ Verified!</div>}
          {verified === false && <div style={{ color: 'red', marginTop: 10 }}>❌ Invalid code</div>}
        </>
      )}
    </div>
  );
};

export default Setup2FA;