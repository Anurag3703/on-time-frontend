// components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';
import AddDeadlineModal from './AddDeadlineModal';
import EmailModal from './EmailModal';

const Navbar = ({ userEmail, setUserEmail }) => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleLogout = () => {
    setUserEmail('');
    localStorage.removeItem('userEmail');
  };

  const handleAddDeadlineClick = () => {
    if (userEmail) {
      setShowDeadlineModal(true);
    } else {
      setShowEmailModal(true);
    }
  };

  const handleDeadlineAdded = () => {
    setShowDeadlineModal(false);
    // You may want to refresh deadlines list here if needed
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <span className="logo-text">On Time</span>
            <i className="far fa-clock"></i>
          </Link>
          
          <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
          </div>
          
          <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={() => setIsMenuOpen(false)}>
                Calendar
              </Link>
            </li>
            
            <li className="nav-item">
              <Link to="/deadlines" className="nav-links" onClick={() => setIsMenuOpen(false)}>
                My Deadlines
              </Link>
            </li>
            
            <li className="nav-item">
              <button 
                className="add-deadline-btn" 
                onClick={handleAddDeadlineClick}
              >
                <i className="fas fa-plus"></i> Add Deadline
              </button>
            </li>
            
            <li className="nav-item">
              {userEmail ? (
                <div className="user-info">
                  <span className="email-display">{userEmail}</span>
                  <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
                </div>
              ) : (
                <button className="signin-btn" onClick={() => setShowEmailModal(true)}>
                  Sign In
                </button>
              )}
            </li>
          </ul>
        </div>
      </nav>
      
      {showEmailModal && (
        <EmailModal 
          setShowEmailModal={setShowEmailModal} 
          setUserEmail={setUserEmail} 
        />
      )}

      {showDeadlineModal && (
        <AddDeadlineModal
          selectedDate={selectedDate}
          userEmail={userEmail}
          onClose={() => setShowDeadlineModal(false)}
          onDeadlineAdded={handleDeadlineAdded}
        />
      )}
    </>
  );
};

export default Navbar;