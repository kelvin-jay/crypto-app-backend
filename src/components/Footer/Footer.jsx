import React from 'react'
import './Footer.css'


const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-list">
              <li><a href="#" className="footer-link">Markets</a></li>
              <li><a href="#" className="footer-link">Education</a></li>
              <li><a href="#" className="footer-link">Support</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h4 className="footer-title">Company</h4>
            <ul className="footer-list">
              <li><a href="#" className="footer-link">About</a></li>
              <li><a href="#" className="footer-link">Blog</a></li>
              <li><a href="#" className="footer-link">Careers</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h4 className="footer-title">Legal</h4>
            <ul className="footer-list">
              <li><a href="#" className="footer-link">Terms & Conditions</a></li>
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h4 className="footer-title">Contact Us</h4>
            <ul className="footer-list">
              <li><a href="mailto:info@example.com" className="footer-link">info@example.com</a></li>
              <li><a href="tel:+0123456789" className="footer-link">+0123 456 789</a></li>
            </ul>
            <div className="social-links">
              <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
              <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
              <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2025, CryptoApp. All rights reserved.</p>
          <p>Designed and Developed by <a href="#" target="_blank" rel="noopener noreferrer">Adam Helms</a></p>
          <p className="disclaimer">
            Disclaimer: The information contained in this website is for general information purposes only. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.
          </p>
        </div>
      </div>
    </footer>

  )
}

export default Footer