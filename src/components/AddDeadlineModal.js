// pages/AllDeadlines.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddDeadlineModal from '../components/AddDeadlineModal';
import DeadlinesList from '../components/DeadlinesList';
import { getAllDeadlines } from '../services/api';

const AllDeadlines = ({ userEmail }) => {
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userEmail) {
      navigate('/');
      return;
    }

    const fetchDeadlines = async () => {
      setLoading(true);
      const data = await getAllDeadlines(userEmail);
      setDeadlines(data);
      setLoading(false);
    };

    fetchDeadlines();
  }, [userEmail, navigate]);

  const handleDeadlineAdded = () => {
    // Refresh deadlines after adding a new one
    getAllDeadlines(userEmail).then(data => {
      setDeadlines(data);
      setShowAddModal(false);
    });
  };

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  if (!userEmail) {
    return (
      <div className="sign-in-prompt">
        <h2>Sign In Required</h2>
        <p>Please sign in to view and manage your deadlines.</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="deadlines-container">
      <div className="deadlines-header">
        <h1>Your Deadlines</h1>
        <p>Track all your important deadlines in one place</p>
      </div>

      <div className="deadlines-actions">
        <button className="add-deadline-btn-large" onClick={toggleAddModal}>
          <i className="fas fa-plus"></i> Add New Deadline
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading your deadlines...</span>
        </div>
      ) : deadlines.length === 0 ? (
        <div className="no-deadlines">
          <p>You don't have any deadlines yet. Click "Add New Deadline" to get started.</p>
        </div>
      ) : (
        <DeadlinesList deadlines={deadlines} setDeadlines={setDeadlines} />
      )}

      {showAddModal && (
        <AddDeadlineModal
          userEmail={userEmail}
          onClose={toggleAddModal}
          onDeadlineAdded={handleDeadlineAdded}
        />
      )}
    </div>
  );
};

export default AllDeadlines;