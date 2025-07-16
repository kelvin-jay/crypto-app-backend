import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import { NavLink, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import TradingViewWidget from '../Chat/TradingViewWidget';
import TradingViewTickerTape from '../../components/TradingViewTickerTape';
import Preloader from '../Home/Preloader';

const menuItems = [
  { icon: 'fa-solid fa-house', label: 'Dashboard', path: '/dashboard' },
  { icon: 'fas fa-arrow-up', label: 'Upgrade Account', path: '/upgrade' },
  { icon: 'fas fa-shopping-cart', label: 'Purchase Trade', path: '/purchase' },
  { icon: 'fas fa-wallet', label: 'Deposit', path: '/deposit' },
  { icon: 'fas fa-sign-out-alt', label: 'Withdraw', path: '/withdraw' },
  { icon: 'fas fa-user-circle', label: 'Account', path: '/account' },
  { icon: 'fas fa-id-card', label: 'Profile', path: '/profile' },
  { icon: 'fas fa-chart-line', label: 'Live Trade', path: '/live-trade' },
  { icon: 'fas fa-history', label: 'Trade History', path: '/trade-history' },
  { icon: 'fas fa-shield-alt', label: 'KYC', path: '/kyc' },
];
const supportedCoins = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'USDT', name: 'Tether (USDT)' },
];
const ANNOUNCEMENT_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

const Dashboard = () => {
  const [user, setUser] = useState({ name: '' });
  const [greeting, setGreeting] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [balances, setBalances] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [uid, setUid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = firebase.auth();
        const currentUser = auth.currentUser;
        if (currentUser) {
          setUser({ name: currentUser.displayName });
          setUid(currentUser.uid);

          // Fetch balances
          const db = firebase.database();
          const balSnap = await db.ref(`users/${currentUser.uid}/balances`).once('value');
          setBalances(balSnap.val() || {});

          // Fetch recent transactions (last 10)
          const txSnap = await db.ref(`users/${currentUser.uid}/transactions`).limitToLast(10).once('value');
          const txArr = txSnap.val() ? Object.values(txSnap.val()) : [];
          setTransactions(txArr.reverse());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) setGreeting('Good morning');
    else if (currentTime < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const auth = firebase.auth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser({ name: currentUser.displayName });
        setUid(currentUser.uid);

        // Fetch balances
        const db = firebase.database();
        const balSnap = await db.ref(`users/${currentUser.uid}/balances`).once('value');
        setBalances(balSnap.val() || {});

        // Fetch KYC status
        const kycSnap = await db.ref(`users/${currentUser.uid}/kycStatus`).once('value');
        setUser(prev => ({
          ...prev,
          kycStatus: kycSnap.val() || "not_submitted"
        }));

        // Fetch recent transactions (last 10)
        const txSnap = await db.ref(`users/${currentUser.uid}/transactions`).limitToLast(10).once('value');
        const txArr = txSnap.val() ? Object.values(txSnap.val()) : [];
        setTransactions(txArr.reverse());
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  fetchUserData();
}, []);

  // Fetch global announcement from Realtime Database
  useEffect(() => {
    const db = firebase.database();
    const ref = db.ref('global_announcement');
    ref.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data && data.text && data.timestamp) {
        const now = Date.now();
        if (now - data.timestamp < ANNOUNCEMENT_EXPIRY_MS) {
          setAnnouncement(data.text);
        } else {
          setAnnouncement('');
          ref.remove();
        }
      } else if (typeof data === 'string') {
        setAnnouncement(data);
      } else {
        setAnnouncement('');
      }
    });
    return () => ref.off();
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await firebase.auth().signOut();
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const handleHamburgerClick = () => {
    if (window.innerWidth <= 900) {
      setShowMenu(!showMenu);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleOverlayClick = () => setShowMenu(false);

  return (
    <div>
      <TradingViewTickerTape />
      <Preloader />
      <div className="dashboard-container">
        {/* Sidebar */}
        <div className={`left-sidebar${showMenu ? ' show-menu' : ''}${collapsed ? ' collapsed' : ''}`}>
          <div className="close-menu" onClick={handleOverlayClick}>
            <i className="fas fa-times" />
          </div>
          <div className="profile-section">
            <div className="profile-icon">
              <i className="fa fa-user" />
            </div>
            {!collapsed && (
              user.name ? (
                <h2>{greeting}, {user.name}</h2>
              ) : (
                <div className="loading-animation">
                  <div className="spinner"></div>
                  <p>Loading...</p>
                </div>
              )
            )}
          </div>
          <ul>
            {menuItems.map(item => (
              <li key={item.label} className="sidebar-menu-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  title={item.label}
                  onClick={() => setShowMenu(false)}
                  end
                >
                  <i className={item.icon}></i>
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
                {collapsed && (
                  <span className="sidebar-tooltip-adv">{item.label}</span>
                )}
              </li>
            ))}
            <li className="sidebar-menu-item">
              <a href="#" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                {!collapsed && <span>Logout</span>}
              </a>
              {collapsed && (
                <span className="sidebar-tooltip-adv">Logout</span>
              )}
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className={`right-sidebar${collapsed ? ' collapsed' : ''}`}>
          <div className="top-bar">
            <i className="fas fa-bars" onClick={handleHamburgerClick} />
            <p>Welcome to your Dashboard</p>
          </div>
          <div className="right-sidebar-content">
            {/* --- ANNOUNCEMENT BANNER --- */}
            {announcement && (
              <div className="global-announcement">
                <i className="fa fa-bullhorn" style={{ marginRight: 8, color: '#007bff' }} />
                <span>{announcement}</span>
              </div>
            )}
            {/* --- END ANNOUNCEMENT --- */}
          {user.kycStatus !== "verified" && (
  <div className="alert">
    <h2>Account not yet verified!</h2>
    Document verification is required to complete registration. Click
    <NavLink to="/kyc" style={{ color: 'blue', marginLeft: 4 }}>here</NavLink> to upload document.
  </div>
)}
            <div className="column">
              <div className="balance">
                <h3>BALANCE</h3>
                <p>${balances.USD || 0}</p>
                <p>Bitcoin: {balances.BTC || 0}</p>
                <p>Ethereum: {balances.ETH || 0}</p>
                <p>USDT: {balances.USDT || 0}</p>
              </div>
              <div className="profit-return">
                <h3>PROFIT RETURN</h3>
                <p>${balances.profitUSD || 0}</p>
                <p>Bitcoin: {balances.profitBTC || 0}</p>
                <p>Ethereum: {balances.profitETH || 0}</p>
              </div>
              <div className="bonus">
                <h3>BONUS</h3>
                <p>${balances.bonusUSD || 0}</p>
                <p>Bitcoin: {balances.bonusBTC || 0}</p>
                <p>Ethereum: {balances.bonusETH || 0}</p>
              </div>
              <div className="total-deposit">
                <h3>TOTAL DEPOSIT</h3>
                <p>${balances.totalDepositUSD || 0}</p>
                <p>Bitcoin: {balances.totalDepositBTC || 0}</p>
                <p>Ethereum: {balances.totalDepositETH || 0}</p>
              </div>
              <div className="deposit">
                <i className="fas fa-wallet deposit-icon"></i>
                <h3>DEPOSIT</h3>
              </div>
              <div className="withdrawal">
                <i className="fas fa-sign-out-alt deposit-icon"></i>
                <h3>WITHDRAWAL</h3>
              </div>
              <div className="subscription">
                <i className="fa-solid fa-credit-card deposit-icon" />
                <p>Not subscribed</p>
              </div>
              <div className="total-withdrawal">
                <h3>TOTAL WITHDRAWAL</h3>
                <p>${balances.totalWithdrawalUSD || 0}</p>
                <p>Bitcoin: {balances.totalWithdrawalBTC || 0}</p>
                <p>Ethereum: {balances.totalWithdrawalETH || 0}</p>
              </div>
            </div>
            <div className="notification">
              <i className="fa-solid fa-bullhorn deposit-icon"></i>
              <p>Account is not verified</p>
            </div>
            <div className="trading-progress">
              <i className="fa-solid fa-bullhorn deposit-icon"></i>
              <p style={{ background: '#000', width: '100%', padding: '0 2px', borderRadius: '10px' }}>0%</p>
            </div>
            <div className="chart-section">
              <TradingViewWidget />
            </div>
          </div>
          {/* Portfolio Summary */}
          <div className="portfolio-summary">
            <h3>Portfolio Summary</h3>
            <div className="portfolio-chart">
              {/* Simple Pie Chart using SVG */}
              <svg width="120" height="120" viewBox="0 0 32 32">
                <circle r="16" cx="16" cy="16" fill="#eee" />
                <circle r="16" cx="16" cy="16" fill="transparent" stroke="#ffc300" strokeWidth="32"
                  strokeDasharray="50 50" strokeDashoffset="0" />
                <circle r="16" cx="16" cy="16" fill="transparent" stroke="#007bff" strokeWidth="32"
                  strokeDasharray="30 70" strokeDashoffset="-50" />
                <circle r="16" cx="16" cy="16" fill="transparent" stroke="#28a745" strokeWidth="32"
                  strokeDasharray="20 80" strokeDashoffset="-80" />
              </svg>
              <div className="portfolio-legend">
                <div><span style={{ background: '#ffc300' }}></span> Bitcoin</div>
                <div><span style={{ background: '#007bff' }}></span> Ethereum</div>
                <div><span style={{ background: '#28a745' }}></span> USDT</div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="recent-transactions">
            <h3>Recent Transactions</h3>
            <ul>
              {transactions.length === 0 && (
                <li>No transactions found.</li>
              )}
              {transactions.map((tx, idx) => (
                <li key={idx}>
                  <span className={`tx-type ${tx.type}`}>{tx.type}</span>
                  <span>${tx.amount}</span>
                  <span>{tx.symbol}</span>
                  <span className="tx-date">{tx.date ? new Date(tx.date).toLocaleDateString() : ''}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Buy Bitcoin Section */}
          <div className="buy-bitcoin-section">
            <h3>Buy Crypto</h3>
            <form
              onSubmit={async e => {
                e.preventDefault();
                const coin = e.target.elements['coin'].value;
                const amount = e.target.elements['buy-amount'].value;
                const address = e.target.elements['crypto-address'].value;

                try {
                  const res = await fetch('http://localhost:5000/api/buy-crypto', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ coin, amount, address }),
                  });
                  const data = await res.json();
                  if (data.invoice_url) {
                    window.location.href = data.invoice_url; // Redirect to payment
                  } else {
                    alert(data.error || 'Failed to process purchase.');
                  }
                } catch (err) {
                  alert('Network error. Please try again.');
                }
              }}
              className="buy-btc-form"
            >
              <div>
                <label htmlFor="coin">Select Coin:</label>
                <select id="coin" name="coin" required>
                  {supportedCoins.map(c => (
                    <option key={c.symbol} value={c.symbol}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="buy-amount">Amount (USD):</label>
                <input type="number" id="buy-amount" min="10" step="1" placeholder="Enter USD amount" required />
              </div>
              <div>
                <label htmlFor="crypto-address">Your Wallet Address:</label>
                <input type="text" id="crypto-address" placeholder="Paste your wallet address" required />
              </div>
              <button type="submit" className="buy-btc-btn">Buy</button>
            </form>
          </div>
        </div>
        {/* Overlay for mobile menu */}
        {showMenu && <div className="sidebar-overlay" onClick={handleOverlayClick}></div>}
      </div>
    </div>
  );
};

export default Dashboard;