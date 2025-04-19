// components/DeadlineItem.js
import React, { useState } from 'react';
import { deleteDeadline } from '../services/api';
import '../styles/deadlines.css';

const DeadlineItem = ({ deadline, onDeleteSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteAnimation, setDeleteAnimation] = useState('');
  
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
  
  const handleDeleteClick = async () => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      setDeleteAnimation('deadline-delete-animation');
      
      // Wait for animation to start before making API call
      setTimeout(async () => {
        const userEmail = localStorage.getItem('userEmail');
        await deleteDeadline(userEmail, deadline.id);
        
        // If we have a callback for deletion success, call it
        if (onDeleteSuccess) {
          setTimeout(() => {
            onDeleteSuccess(deadline.id);
          }, 300); // Small delay to complete animation
        }
      }, 300); // Start API call after animation starts
    } catch (error) {
      console.error('Failed to delete deadline:', error);
      setIsDeleting(false);
      setDeleteAnimation('');
      alert('Failed to delete deadline. Please try again.');
    }
  };
  
  const { statusText, statusClass } = getStatusInfo();
  const daysRemaining = calculateDaysRemaining();
  
  return (
    <div className={`deadline-card ${statusClass} ${deleteAnimation}`}>
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
      
      <div className="deadline-actions">
        <button 
          className={`deadline-delete-btn ${isDeleting ? 'deleting' : ''}`}
          onClick={handleDeleteClick}
          disabled={isDeleting}
          title="Delete this deadline"
        >
          {isDeleting ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> 
              <span>Deleting...</span>
            </>
          ) : (
            <>
              <i className="fas fa-trash-alt"></i>
              <span>Delete</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DeadlineItem;