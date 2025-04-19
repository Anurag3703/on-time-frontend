// components/Footer.js
import React from 'react';
import '../styles/footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="social-section">
        <p className="follow-text">Follow us on</p>
        <div className="social-icons">
          <a href="mailto:tiwarianurag3703@gmail.com" className="social-icon email-icon">
            <i className="fas fa-envelope"></i>
          </a>
          <a href="https://github.com/Anurag3703" target="_blank" rel="noopener noreferrer" className="social-icon">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://www.linkedin.com/in/anurag-tiwari-952721260/" target="_blank" rel="noopener noreferrer" className="social-icon">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} On Time. All rights reserved.</p>
      </div>
      
      {/* Hidden div to catch and hide the userStyle tag */}
      <div className="style-remover"></div>
    </footer>
  );
};

export default Footer;