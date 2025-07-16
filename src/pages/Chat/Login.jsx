import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { auth, db } from './firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import Preloader from '../Home/Preloader';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false); // Add this line
  const navigate = useNavigate();
  const storeUserData = async (user) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        name: user.displayName || 'Anonymous',
        email: user.email,
      });
    } catch (e) {
      console.error('Error storing user data: ', e);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        toast.warning('Please verify your email before logging in.');
        await auth.signOut();
        return;
      }

      await storeUserData(user);
      toast.success('Login successful!');
      navigate('/Dashboard');
    } catch (error) {
      console.error('Login error:', error);
      switch (error.code) {
        case 'auth/invalid-email':
          toast.error('Invalid email address!');
          break;
        case 'auth/user-not-found':
          toast.error('User not found!');
          break;
        case 'auth/wrong-password':
          toast.error('Wrong password!');
          break;
        default:
          toast.error(error.message);
      }
    }
  };

   const signupWithGoogle = async () => {
    if (googleLoading) return; // Prevent multiple popups
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await storeUserData(user);
      toast.success('Signed in with Google!');
      navigate('/Dashboard');
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        toast.warning('Google sign-in was cancelled.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        toast.warning('Another popup was already open.');
      } else {
        console.error('Google login error:', error);
        toast.error('Google sign-in failed.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetPasswordEmail) {
      toast.error('Enter your email first.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetPasswordEmail);
      toast.success('Password reset email sent!');
      setShowResetPassword(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleNavigateToSignup = () => {
    navigate('/Signup');
  };

  return (
    <div>
      <Navbar />
      <Preloader />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="login-container">
        <h2 style={{ fontSize: 20, fontWeight: 'bold' }}>Sign in to start your session</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button onClick={handleLogin}>Login</button>

        <p>
          <span
            style={{ cursor: 'pointer', color: 'blue' }}
            onClick={() => setShowResetPassword(true)}
          >
            Forgot Password?
          </span>
        </p>

        {showResetPassword && (
          <div>
            <input
              type="email"
              value={resetPasswordEmail}
              onChange={(e) => setResetPasswordEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <button onClick={handleResetPassword}>Reset Password</button>
          </div>
        )}

        <p>
          Don't have an account?{' '}
          <span
            onClick={handleNavigateToSignup}
            style={{ cursor: 'pointer', color: 'red' }}
          >
            Signup
          </span>
        </p>

        <hr />
        <h2 style={{ fontSize: 15 }}>Or Login with</h2>

         <button
        className="signup-google-btn"
        onClick={signupWithGoogle}
        disabled={googleLoading} // Disable while loading
      >
        <FaGoogle className="google-icon" />
        <span className="google-text">
          {googleLoading ? "Signing in..." : "Google"}
        </span>
      </button>
      </div>
    </div>
  );
};

export default Login;
