import React, { useState, useEffect, Switch} from 'react';
import Loader from './pages/Loader';
import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './pages/Home/Home'
import Features from './pages/Features/Features'
import Coin from './pages/Coin/Coin'
import Footer from './components/Footer/Footer'
import NotFound from './pages/NoteFound/NoteFound'
import Pricing from './pages/Pricing/Pricing'
import Company from './pages/Company/Company'
import Trading from './pages/Trading/Trading'
import Market from './pages/Market/Market';
import Team from './pages/Team/Team'
import Chat from './pages/Chat/Chat';
import Login from './pages/Chat/Login';
import Signup from './pages/Chat/Signup'
import Dashboard from './pages/Chat/Dashboard'
import firebase from 'firebase/compat/app';
import AdminDashboard from './pages/Chat/AdminDashboard';
import EarnPopUp from './pages/Home/EarnPopUp';
import Deposit from './pages/chat/Deposit';
import AOS from 'aos';
import 'aos/dist/aos.css';
import UpgradeAccount from './pages/Chat/UpgradeAccount';
import PurchaseTrade from './pages/Chat/PurchaseTrade';
import Withdraw from './pages/Chat/Withdraw';
import KYC from './pages/Chat/KYC';
import KYCStatus from './pages/Chat/KYCStatus';
import Account from './pages/Chat/Account';
import Profile from './pages/Chat/Profile';



const App = () => {
  const navigate = useNavigate();
 
  const [loading, setLoading] = useState(true);


  // Initialize AOS for animations
  useEffect(() => {
  AOS.init({ duration: 900, once: true });
}, []);

  // Define public routes that do not require authentication
  // These routes can be accessed without being logged in

  const publicRoutes = [
  '/login', '/signup', '/', '/Features', '/Pricing', '/Company', '/Trading', '/Team', '/Market', '/admin', '/deposit'
];
  // Check if the user is authenticated and redirect if not
  // This effect runs on every route change
  // If the user is not authenticated and the route is not public, redirect to login
  // If the user is authenticated, allow access to the route
  // This effect runs on every route change
  // If the user is not authenticated and the route is not public, redirect to login
  // If the user is authenticated, allow access to the route

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user && !publicRoutes.includes(window.location.pathname)) {
        navigate('/login');
      }
    });
    return () => {
      unsubscribe();
    };
  }, [navigate]);
  
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return <Loader />
  }

  return (
    <div className='app'>
       <EarnPopUp />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Features' element={<Features/>}/>
        <Route path='/Pricing' element={<Pricing/>}/>
        <Route path='/Company' element={<Company/>}/>
        <Route path='/Trading' element={<Trading/>}/>
        <Route path='/Market' element={<Market/>}/>
        <Route path='/Team' element={<Team/>}/>
        <Route path='/coin/:coinId' element={<Coin/>}/>
        <Route path='*' element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/deposit" element={<Deposit />} />
          <Route path="/upgrade" element={<UpgradeAccount />} />
        <Route path="/purchase" element={<PurchaseTrade />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/kyc" element={<KYC />} />
        <Route path="/kyc/status/:email" element={<KYCStatus />} />
        <Route path="/account" element={<Account />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Chat />
      <Footer/>
    </div>
  )
}

export default App;

