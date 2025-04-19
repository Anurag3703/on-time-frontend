// pages/Home.js - Main Calendar View
import React, { useEffect, useState } from 'react';
import AddDeadlineModal from '../components/AddDeadlineModal';
import Calendar from '../components/Calendar';
import EmailModal from '../components/EmailModal';
import { getAllDeadlines } from '../services/api';
import '../styles/calendar.css';

const Home = ({ userEmail, setUserEmail }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [deadlines, setDeadlines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userEmail) {
      fetchDeadlines();
    }
  }, [userEmail]);

  const fetchDeadlines = async () => {
    setIsLoading(true);
    try {
      const data = await getAllDeadlines(userEmail);
      setDeadlines(data || []);
    } catch (error) {
      console.error('Error fetching deadlines:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    if (userEmail) {
      setShowDeadlineModal(true);
    } else {
      setShowEmailModal(true);
    }
  };

  const handleDeadlineAdded = () => {
    setShowDeadlineModal(false);
    fetchDeadlines();
  };

  return (
    <div className="home-container">
      <div className="calendar-header">
        <h1>Manage Your Deadlines</h1>
        <p>Stay on top of your important dates and deadlines</p>
      </div>
      
      {isLoading ? (
        <div className="loading-spinner">Loading your deadlines...</div>
      ) : (
        <Calendar 
          onDateClick={handleDateClick} 
          deadlines={deadlines}
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

      {showEmailModal && (
        <EmailModal
          setShowEmailModal={setShowEmailModal}
          setUserEmail={setUserEmail}
        />
      )}
    </div>
  );
};

export default Home;