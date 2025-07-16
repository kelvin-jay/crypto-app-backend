import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBitcoin, FaEthereum, FaRegCopy } from 'react-icons/fa';
import { SiTether } from 'react-icons/si';
import './Withdraw.css';

const coins = [
  { symbol: 'BTC', name: 'Bitcoin', icon: <FaBitcoin color="#f7931a" /> },
  { symbol: 'ETH', name: 'Ethereum', icon: <FaEthereum color="#627eea" /> },
  { symbol: 'USDT', name: 'Tether', icon: <SiTether color="#26a17b" /> },
];

const networks = {
  USDT: ['ERC20', 'TRC20', 'BEP20'],
  BTC: ['Bitcoin'],
  ETH: ['Ethereum'],
};

const mockBalances = {
  BTC: 0.05,
  ETH: 1.2,
  USDT: 500,
};

const dailyLimit = {
  BTC: 2,
  ETH: 10,
  USDT: 10000,
};

const Withdraw = () => {
  const [coin, setCoin] = useState('BTC');
  const [network, setNetwork] = useState('Bitcoin');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [twoFA, setTwoFA] = useState('');
  const [history, setHistory] = useState([
    { id: 1, coin: 'BTC', amount: 0.01, address: 'bc1q...xyz', date: '2024-06-21', status: 'Completed', network: 'Bitcoin' },
    { id: 2, coin: 'ETH', amount: 0.2, address: '0xabc...123', date: '2024-06-20', status: 'Completed', network: 'Ethereum' },
    { id: 3, coin: 'USDT', amount: 100, address: 'TXYZ...abc', date: '2024-06-19', status: 'Pending', network: 'TRC20' },
  ]);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(null);
  const [twoFAVerified, setTwoFAVerified] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setNetwork(networks[coin][0]);
  }, [coin]);

  const balance = mockBalances[coin];
  const withdrawAmount = Number(amount) || 0;
  const fee = withdrawAmount > 0 ? Math.max(coin === 'USDT' ? 1 : 0.0005, withdrawAmount * 0.01) : 0;
  const total = withdrawAmount + fee;

  const today = new Date().toISOString().slice(0, 10);
  const withdrawnToday = history
    .filter(tx => tx.date === today && tx.coin === coin)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const limitExceeded = withdrawnToday + withdrawAmount > dailyLimit[coin];

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1200);
  };

  // 2FA verification before withdrawal
  const verify2FA = async () => {
    const res = await fetch('http://localhost:4243/2fa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: twoFA }),
    });
    const data = await res.json();
    setTwoFAVerified(data.verified);
    return data.verified;
  };

  const handleWithdraw = async () => {
    if (
      !withdrawAmount ||
      !address ||
      withdrawAmount > balance ||
      twoFA.length !== 6 ||
      limitExceeded
    ) return;
    setProcessing(true);
    const valid2FA = await verify2FA();
    if (!valid2FA) {
      setProcessing(false);
      return;
    }
    setTimeout(() => {
      setHistory([
        {
          id: Date.now(),
          coin,
          amount: withdrawAmount,
          address,
          date: today,
          status: 'Pending',
          network,
        },
        ...history,
      ]);
      setSuccess(true);
      setProcessing(false);
      setAmount('');
      setAddress('');
      setTwoFA('');
      setTwoFAVerified(null);
    }, 2000);
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="withdraw-bg">
      <div className="withdraw-container">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Withdraw Crypto</h1>
        <div className="withdraw-form beautiful-card">
          <label>
            Select Coin:
            <div className="coin-select">
              <select value={coin} onChange={e => setCoin(e.target.value)}>
                {coins.map(c => (
                  <option key={c.symbol} value={c.symbol}>{c.name}</option>
                ))}
              </select>
              <span className="coin-icon">{coins.find(c => c.symbol === coin)?.icon}</span>
            </div>
          </label>
          {networks[coin].length > 1 && (
            <label>
              Network:
              <select value={network} onChange={e => setNetwork(e.target.value)}>
                {networks[coin].map(net => (
                  <option key={net} value={net}>{net}</option>
                ))}
              </select>
            </label>
          )}
          <label>
            Amount:
            <input
              type="number"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder={`Max: ${balance} ${coin}`}
            />
            <span className="balance-info">Balance: {balance} {coin}</span>
          </label>
          <label>
            Wallet Address:
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Enter recipient wallet address"
            />
          </label>
          <label>
            2FA Code:
            <input
              type="text"
              value={twoFA}
              onChange={e => setTwoFA(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 2FA code"
              maxLength={6}
            />
            {twoFAVerified === false && (
              <span style={{ color: 'red', fontSize: 13, marginLeft: 8 }}>Invalid 2FA code</span>
            )}
          </label>
          <div className="withdraw-summary">
            <div>
              Fee: <b>{withdrawAmount ? fee.toFixed(coin === 'USDT' ? 2 : 6) : '--'} {coin}</b>
            </div>
            <div>
              Total: <b>{withdrawAmount ? total.toFixed(coin === 'USDT' ? 2 : 6) : '--'} {coin}</b>
            </div>
          </div>
          <div className="processing-time">
            Estimated processing time: <b>10-30 minutes</b>
          </div>
          {limitExceeded && (
            <div className="limit-warning">
              <b>Warning:</b> Daily withdrawal limit exceeded for {coin} ({dailyLimit[coin]} {coin}/day)
            </div>
          )}
          <button
            className={`withdraw-btn${processing ? ' processing' : ''}`}
            disabled={
              !withdrawAmount ||
              !address ||
              withdrawAmount > balance ||
              processing ||
              twoFA.length !== 6 ||
              limitExceeded
            }
            onClick={handleWithdraw}
          >
            {processing ? 'Processing...' : 'Withdraw'}
          </button>
          {success && (
            <div className="withdraw-success animate-pop">
              <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="#28a745" />
                <path d="M14 25l7 7 13-13" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Withdrawal request submitted!
            </div>
          )}
        </div>

        <div className="withdraw-history beautiful-card">
          <h2>Withdrawal History</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Coin</th>
                <th>Amount</th>
                <th>Network</th>
                <th>Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map(tx => (
                <tr key={tx.id}>
                  <td>{tx.date}</td>
                  <td>{tx.coin} {coins.find(c => c.symbol === tx.coin)?.icon}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.network}</td>
                  <td className="address-cell">
                    {tx.address}
                    <FaRegCopy
                      style={{ marginLeft: 6, cursor: 'pointer', color: copied === tx.id ? '#28a745' : '#888' }}
                      title="Copy address"
                      onClick={() => handleCopy(tx.address, tx.id)}
                    />
                    {copied === tx.id && <span className="copied-msg">Copied!</span>}
                  </td>
                  <td>
                    <span className={`status-badge ${tx.status}`}>{tx.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="security-notice beautiful-card">
          <strong>Security Notice:</strong> Withdrawals are processed after security checks. Double-check wallet addresses before submitting.
        </div>
      </div>
    </div>
  );
};

export default Withdraw;