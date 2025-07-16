import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './UpgradeAccount.css';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    features: [
      'Basic trading tools',
      'Portfolio overview',
      'Standard support',
      'Access to learning resources',
    ],
    badge: 'Current',
    gradient: 'linear-gradient(135deg, #e0e7ff 0%, #fff 100%)',
  },
  {
    name: 'Trader',
    price: '$29/mo',
    features: [
      'All Starter features',
      'Advanced charting',
      'Priority support',
      'Faster withdrawals',
      'API access',
    ],
    badge: 'Popular',
    gradient: 'linear-gradient(135deg, #c2e9fb 0%, #81a4fd 100%)',
  },
  {
    name: 'Pro',
    price: '$79/mo',
    features: [
      'All Trader features',
      'Personal account manager',
      'Exclusive market insights',
      'Early access to new features',
      'Higher withdrawal limits',
    ],
    badge: 'Best Value',
    gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
  },
];

const UpgradeAccount = () => {
  const [selectedPlan, setSelectedPlan] = useState('Trader');
  const [upgraded, setUpgraded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Show success message if redirected from Stripe
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('success') === '1') {
      setUpgraded(true);
      setSelectedPlan(params.get('plan') || 'Trader');
      // Optionally, here you can update user status in your DB
    }
    if (params.get('canceled') === '1') {
      setUpgraded(false);
    }
  }, [location.search]);

  const handleUpgrade = async () => {
    if (selectedPlan === 'Starter') return;
    try {
      const res = await fetch('http://localhost:4242/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        alert('Payment error: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  };

  return (
    <div className="upgrade-adv-container">
      <div className="upgrade-adv-header">
        <button className="back-btns" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Upgrade Your Crypto Account</h1>
        <p>
          Unlock more power, insights, and support. Choose the plan that fits your trading journey.
        </p>
      </div>
      <div className="adv-plan-cards">
        {plans.map(plan => (
          <div
            key={plan.name}
            className={`adv-plan-card${selectedPlan === plan.name ? ' selected' : ''}`}
            style={{
              background: plan.gradient,
              animation: selectedPlan === plan.name ? 'cardPop 0.4s' : undefined,
            }}
            onClick={() => setSelectedPlan(plan.name)}
          >
            <div className="adv-plan-header">
              <h2>{plan.name}</h2>
              <span className={`adv-plan-badge badge-${plan.badge.replace(' ', '').toLowerCase()}`}>{plan.badge}</span>
            </div>
            <div className="adv-plan-price">{plan.price}</div>
            <ul className="adv-plan-features">
              {plan.features.map(f => (
                <li key={f}><span>✔</span> {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {!upgraded ? (
        <button
          className="adv-upgrade-btn"
          onClick={handleUpgrade}
          disabled={selectedPlan === 'Starter'}
        >
          {selectedPlan === 'Starter' ? 'Already on Starter Plan' : `Upgrade to ${selectedPlan}`}
        </button>
      ) : (
        <div className="adv-upgrade-success animate-pop">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill="#28a745" />
            <path d="M14 25l7 7 13-13" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3>Upgrade Successful!</h3>
          <p>Your account is now on the <b>{selectedPlan}</b> plan. Enjoy your new features!</p>
        </div>
      )}

      <div className="adv-upgrade-faq">
        <h3>Frequently Asked Questions</h3>
        <details>
          <summary>What payment methods can I use?</summary>
          <p>We accept credit/debit cards, crypto payments, and MoonPay.</p>
        </details>
        <details>
          <summary>Can I switch plans later?</summary>
          <p>Yes, you can upgrade or downgrade your plan anytime from your account settings.</p>
        </details>
        <details>
          <summary>Need help?</summary>
          <p>Contact our support team for any questions about upgrading.</p>
        </details>
      </div>
    </div>
  );
};

export default UpgradeAccount;