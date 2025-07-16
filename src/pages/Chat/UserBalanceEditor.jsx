import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "./UserManagement.css";

const supportedCoins = [
  { symbol: "USD", name: "US Dollar" },
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "USDT", name: "Tether" },
  { symbol: "BNB", name: "Binance Coin" },
  { symbol: "SOL", name: "Solana" },
  { symbol: "DOGE", name: "Dogecoin" },
];

const extraFields = [
  { key: "profit", label: "Profit Return" },
  { key: "bonus", label: "Bonus" },
  { key: "totalDeposit", label: "Total Deposit" },
  { key: "totalWithdrawal", label: "Total Withdrawal" },
];

const UserBalanceEditor = ({ user, onClose }) => {
  const [balances, setBalances] = useState({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const db = firebase.database();
    db.ref(`users/${user.uid}/balances`).once("value", snap => {
      setBalances(snap.val() || {});
      setLoading(false);
    });
  }, [user]);

  const handleChange = (field, symbol, value) => {
    setBalances(prev => ({
      ...prev,
      [`${field}${symbol}`]: value
    }));
  };

  const handleMainChange = (symbol, value) => {
    setBalances(prev => ({
      ...prev,
      [symbol]: value
    }));
  };

  const handleSave = async () => {
    const db = firebase.database();
    await db.ref(`users/${user.uid}/balances`).set(balances);
    setMsg("Balances updated!");
    setTimeout(() => setMsg(""), 1500);
    if (onClose) setTimeout(onClose, 1600);
  };

  if (!user) return null;

  return (
    <div className="user-balance-editor-modal">
      <div className="user-balance-editor-content">
        <h3>
          Edit Balances for{" "}
          <span style={{ color: "#007bff" }}>
            {user.name || user.email || user.uid}
          </span>
        </h3>
        {loading ? (
          <div style={{ padding: "2em 0", textAlign: "center" }}>
            <span className="loader"></span> Loading balances...
          </div>
        ) : (
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSave();
            }}
          >
            <h4 className="balance-section-title">Main Balance</h4>
            <div className="balance-section">
              {supportedCoins.map(c => (
                <div className="balance-row" key={c.symbol}>
                  <label className="balance-label" htmlFor={`main-${c.symbol}`}>
                    {c.symbol}
                  </label>
                  <input
                    id={`main-${c.symbol}`}
                    type="number"
                    step="any"
                    min="0"
                    value={balances[c.symbol] ?? ""}
                    onChange={e => handleMainChange(c.symbol, e.target.value)}
                    placeholder={`Enter ${c.symbol} balance`}
                    autoComplete="off"
                  />
                </div>
              ))}
            </div>
            {extraFields.map(field => (
              <div key={field.key} className="balance-section">
                <h4 className="balance-section-title">{field.label}</h4>
                {supportedCoins.map(c => (
                  <div className="balance-row" key={c.symbol}>
                    <label className="balance-label" htmlFor={`${field.key}-${c.symbol}`}>
                      {c.symbol}
                    </label>
                    <input
                      id={`${field.key}-${c.symbol}`}
                      type="number"
                      step="any"
                      min="0"
                      value={balances[`${field.key}${c.symbol}`] ?? ""}
                      onChange={e => handleChange(field.key, c.symbol, e.target.value)}
                      placeholder={`Enter ${c.symbol} ${field.label.toLowerCase()}`}
                      autoComplete="off"
                    />
                  </div>
                ))}
              </div>
            ))}
            <div className="balance-actions">
              <button type="submit" className="save">Save</button>
              <button type="button" className="cancel" onClick={onClose}>Cancel</button>
            </div>
            {msg && <div className="balance-success-msg">{msg}</div>}
          </form>
        )}
      </div>
      <div className="user-balance-editor-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default UserBalanceEditor;