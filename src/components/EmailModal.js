// components/EmailModal.js
import React, { useState } from 'react';
import { addUser } from '../services/api';
import '../styles/modal.css';

const EmailModal = ({ setShowEmailModal, setUserEmail }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await addUser(email);
      setUserEmail(email);
      setShowEmailModal(false);
    } catch (error) {
      setError('Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Sign In</h2>
          <button className="close-btn" onClick={() => setShowEmailModal(false)}>
            &times;
          </button>
        </div>
        
        <div className="modal-body">
          <p>Please enter your email to continue:</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={error ? 'error' : ''}
              />
              {error && <p className="error-message">{error}</p>}
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={() => setShowEmailModal(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;