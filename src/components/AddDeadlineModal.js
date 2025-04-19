// components/AddDeadlineModal.js
import React, { useState } from 'react';
import { addDeadline } from '../services/api';
import '../styles/modal.css';

const AddDeadlineModal = ({ selectedDate, userEmail, onClose, onDeadlineAdded }) => {
  const [formData, setFormData] = useState({
    universityName: '',
    notes: '',
    startDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    endDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.universityName.trim()) {
      setError('University name is required');
      return;
    }
    
    if (!formData.startDate || !formData.endDate) {
      setError('Start and end dates are required');
      return;
    }
    
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('End date cannot be before start date');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const deadlineData = {
        ...formData,
        user: {
          email: userEmail,
        },
      };
      
      await addDeadline(deadlineData);
      onDeadlineAdded();
    } catch (error) {
      setError('Failed to add deadline. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal deadline-modal">
        <div className="modal-header">
          <h2>Add New Deadline</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>University/Institution Name</label>
              <input
                type="text"
                name="universityName"
                value={formData.universityName}
                onChange={handleChange}
                placeholder="Enter university or institution name"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any important notes about this deadline"
                rows="4"
              ></textarea>
            </div>
            
            {error && <p className="error-message">{error}</p>}
            
            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Add Deadline'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDeadlineModal;