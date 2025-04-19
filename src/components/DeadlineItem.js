// components/DeadlineItem.js
import React from 'react';
import '../styles/deadlines.css';

const DeadlineItem = ({ deadline }) => {
  const startDate = new Date(deadline.startDate);
  const endDate = new Date(deadline.endDate);
  
  // Format dates
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Calculate days remaining
  const calculateDaysRemaining = () => {
    const today = new Date();
    const timeDiff = endDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) {
      return 'Expired';
    } else if (daysDiff === 0) {
      return 'Due today';
    } else {
      return `${daysDiff} days left`;
    }
  };
  
  // Determine status and class
  const getStatusInfo = () => {
    const today = new Date();
    
    if (endDate < today) {
      return {
        statusText: 'Expired',
        statusClass: 'status-expired',
      };
    } else if (startDate > today) {
      return {
        statusText: 'Upcoming',
        statusClass: 'status-upcoming',
      };
    } else {
      const daysLeft = Math.ceil((endDate - today) / (1000 * 3600 * 24));
      
      if (daysLeft <= 3) {
        return {
          statusText: 'Urgent',
          statusClass: 'status-urgent',
        };
      } else if (daysLeft <= 7) {
        return {
          statusText: 'Soon',
          statusClass: 'status-soon',
        };
      } else {
        return {
          statusText: 'In Progress',
          statusClass: 'status-progress',
        };
      }
    }
  };
  
  const { statusText, statusClass } = getStatusInfo();
  const daysRemaining = calculateDaysRemaining();
  
  return (
    <div className={`deadline-card ${statusClass}`}>
      <div className="deadline-header">
        <h3 className="deadline-title">{deadline.universityName}</h3>
        <span className={`deadline-status ${statusClass}`}>{statusText}</span>
      </div>
      
      <div className="deadline-dates">
        <div className="date-group">
          <span className="date-label">Starts:</span>
          <span className="date-value">{formatDate(startDate)}</span>
        </div>
        
        <div className="date-group">
          <span className="date-label">Due:</span>
          <span className="date-value">{formatDate(endDate)}</span>
        </div>
      </div>
      
      <div className="deadline-countdown">
        <i className="far fa-clock"></i>
        <span>{daysRemaining}</span>
      </div>
      
      {deadline.notes && (
        <div className="deadline-notes">
          <h4>Notes:</h4>
          <p>{deadline.notes}</p>
        </div>
      )}
    </div>
  );
};

export default DeadlineItem;