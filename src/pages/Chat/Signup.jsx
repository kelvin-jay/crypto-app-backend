import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from './firebase';
import { ref, set, get, child } from "firebase/database";
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import Preloader from "../Home/Preloader";
import { FaGoogle } from 'react-icons/fa';

const countries = [
  { value: 'USA', label: 'United States' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Mexico', label: 'Mexico' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Germany', label: 'Germany' },
  { value: 'France', label: 'France' },
  { value: 'Australia', label: 'Australia' },
  { value: 'China', label: 'China' },
  { value: 'Japan', label: 'Japan' },
  { value: 'India', label: 'India' },
  { value: 'Brazil', label: 'Brazil' },
  { value: 'Russia', label: 'Russia' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'South Korea', label: 'South Korea' },
  { value: 'Italy', label: 'Italy' },
  { value: 'Spain', label: 'Spain' },
  { value: 'Poland', label: 'Poland' },
  { value: 'Netherlands', label: 'Netherlands' },
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Sweden', label: 'Sweden' },
  { value: 'Switzerland', label: 'Switzerland' },
  { value: 'Turkey', label: 'Turkey' },
  { value: 'Thailand', label: 'Thailand' },
  { value: 'Indonesia', label: 'Indonesia' },
  { value: 'Malaysia', label: 'Malaysia' },
  { value: 'Singapore', label: 'Singapore' },
  { value: 'Philippines', label: 'Philippines' },
  { value: 'Vietnam', label: 'Vietnam' },
  { value: 'Argentina', label: 'Argentina' },
  { value: 'Chile', label: 'Chile' },
  { value: 'Colombia', label: 'Colombia' },
  { value: 'Peru', label: 'Peru' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'Saudi Arabia', label: 'Saudi Arabia' },
  { value: 'United Arab Emirates', label: 'United Arab Emirates' },
];


const passwordChecks = [
  { label: "8-15 characters", test: (pw) => pw.length >= 8 && pw.length <= 15 },
  { label: "At least one upper case letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "At least one lower case letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "At least one number", test: (pw) => /\d/.test(pw) },
  { label: "At least one special character", test: (pw) => /[@$!%*?&]/.test(pw) },
];

function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const Signup = () => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [emailAvailable, setEmailAvailable] = useState(true);
  const [usernameCheckPending, setUsernameCheckPending] = useState(false);
  const [emailCheckPending, setEmailCheckPending] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (pw) => passwordChecks.every(check => check.test(pw));

  const checkUsernameExists = async (username) => {
    const dbRef = ref(db);
    try {
      const snapshot = await get(child(dbRef, `users`));
      if (snapshot.exists()) {
        const users = snapshot.val();
        return Object.values(users).some(
          user => user.name?.toLowerCase().trim() === username.toLowerCase().trim()
        );
      }
      return false;
    } catch (error) {
      console.error("Error checking username:", error);
      return false;
    }
  };

  const checkEmailExists = async (emailToCheck) => {
    const dbRef = ref(db);
    try {
      const snapshot = await get(child(dbRef, `users`));
      if (snapshot.exists()) {
        const users = snapshot.val();
        return Object.values(users).some(
          user => user.email?.toLowerCase().trim() === emailToCheck.toLowerCase().trim()
        );
      }
      return false;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  useEffect(() => {
    if (!name.trim()) return;
    setUsernameCheckPending(true);
    debounce(async () => {
      const exists = await checkUsernameExists(name);
      setUsernameAvailable(!exists);
      setUsernameCheckPending(false);
    }, 500)();
  }, [name]);

  useEffect(() => {
    if (!email.trim()) return;
    setEmailCheckPending(true);
    debounce(async () => {
      const exists = await checkEmailExists(email);
      setEmailAvailable(!exists);
      setEmailCheckPending(false);
    }, 500)();
  }, [email]);

  const storeUserData = async (user) => {
    const userRef = ref(db, "users/" + user.uid);
    await set(userRef, {
      name,
      email: user.email,
      country,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError("Please enter your full name");
    if (!country) return setError("Please select your country");
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (!validatePassword(password)) return setError("Password doesn't meet requirements");

    setLoading(true);

    if (!usernameAvailable) return setError("Username is already taken");
    if (!emailAvailable) return setError("Email is already registered");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);

      await storeUserData(userCredential.user);

      alert("A verification email has been sent. Please verify before logging in.");
      navigate('/Login'); // Don't go to dashboard yet!
    } catch (error) {
      console.error(error);
      setError(error.message);
    }

    setLoading(false);
  };

  const signupWithGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const userName = user.displayName || name || email.split('@')[0];

      const userRef = ref(db, `users/${user.uid}`);
      await set(userRef, {
        name: userName,
        email: user.email,
        country,
      });

      navigate('/Dashboard');
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <Preloader />
      <div className="signup-bg">
        <div className="signup-card-adv">
          <h2 className="signup-title">Create your account</h2>
          <form className="signup-form-adv" onSubmit={handleSignup} autoComplete="off">
            <div className="signup-row">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your full name"
                className="signup-input"
                required
              />
              {name && !usernameAvailable && (
                <div className="signup-error">Username is already taken</div>
              )}
              {name && usernameCheckPending && (
                <div className="signup-info">Checking username...</div>
              )}
            </div>

            <div className="signup-row">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="signup-input"
                required
              >
                <option value="">Select Country</option>
                {countries.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="signup-row">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="signup-input"
                required
              />
              {email && !emailAvailable && (
                <div className="signup-error">Email is already registered</div>
              )}
              {email && emailCheckPending && (
                <div className="signup-info">Checking email...</div>
              )}
            </div>

            <div className="signup-row">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="signup-input"
                required
              />
              <div className="password-requirements">
                <p>Password requirements:</p>
                <ul>
                  {passwordChecks.map((check, idx) => {
                    const passed = check.test(password);
                    return (
                      <li key={idx} className={passed ? "pw-check-passed" : "pw-check-failed"}>
                        <span className="pw-checkmark">
                          {passed ? <span className="pw-green-check">&#10004;</span> : <span className="pw-red-x">&#10006;</span>}
                        </span>
                        {check.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="signup-row">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="signup-input"
                required
              />
            </div>

            {error && <div className="signup-error">{error}</div>}

            <button type="submit" className="signup-btn-adv" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>

            <div className="signup-policy">
              By signing up, you agree to our <span className="signup-link">Terms of Service</span> and <span className="signup-link">Privacy Policy</span>.
            </div>
          </form>

          <div className="signup-or"><span>or</span></div>

          <button className="signup-google-btn" onClick={signupWithGoogle} disabled={loading}>
            <FaGoogle className="google-icon" />
            <span className="google-text">Sign up with Google</span>
          </button>

          <div className="signup-login-link">
            Already have an account?{' '}
            <span onClick={() => navigate('/Login')} className="signup-link" style={{ cursor: 'pointer' }}>
              Login here
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
