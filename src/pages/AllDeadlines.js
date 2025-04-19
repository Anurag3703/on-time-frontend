// pages/AllDeadlines.js
import React, { useEffect, useState } from 'react';
import AddDeadlineModal from '../components/AddDeadlineModal';
import DeadlinesList from '../components/DeadlinesList';
import EmailModal from '../components/EmailModal';
import { getAllDeadlines } from '../services/api';
import '../styles/deadlines.css';

const AllDeadlines = ({ userEmail, setUserEmail }) => {
  const [deadlines, setDeadlines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (userEmail) {
      fetchDeadlines();
    }
  }, [userEmail]);

  const fetchDeadlines = async () => {
    if (!userEmail) {
      setShowEmailModal(true);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await getAllDeadlines(userEmail);
      setDeadlines(data || []);
    } catch (error) {
      console.error('Error fetching deadlines:', error);
      setError('Failed to load deadlines. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
    fetchDeadlines(); // Refresh the deadlines list
  };

  return (
    <div className="deadlines-container">
      <div className="deadlines-header">
        <h1>My Deadlines</h1>
        <p>Manage all your upcoming deadlines</p>
      </div>

      <div className="deadlines-actions">
        <button 
          className="add-deadline-btn-large" 
          onClick={handleAddDeadlineClick}
        >
          <i className="fas fa-plus"></i> Add New Deadline
        </button>
      </div>

      {!userEmail && (
        <div className="sign-in-prompt">
          <p>Please sign in to view your deadlines</p>
          <button className="signin-btn" onClick={() => setShowEmailModal(true)}>
            Sign In
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="loading-spinner">Loading your deadlines...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : userEmail && deadlines.length === 0 ? (
        <div className="no-deadlines">
          <p>You don't have any deadlines yet.</p>
          <p>Click the "Add New Deadline" button to get started!</p>
        </div>
      ) : (
        <DeadlinesList deadlines={deadlines} />
      )}

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
    </div>
  );
};

export default AllDeadlines;