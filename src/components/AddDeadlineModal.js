// components/AddDeadlineModal.js
import React, { useState } from 'react';
import { addDeadline } from '../services/api';
import '../styles/modal.css';

const AddDeadlineModal = ({ userEmail, onClose, onDeadlineAdded, selectedDate = null }) => {
  const initialDate = selectedDate || new Date();
  
  const [formData, setFormData] = useState({
    universityName: '',
    startDate: initialDate.toISOString().split('T')[0],
    endDate: initialDate.toISOString().split('T')[0],
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.universityName.trim()) {
      newErrors.universityName = 'Name is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date cannot be before start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addDeadline({
        universityName: formData.universityName,
        startDate: formData.startDate,
        endDate: formData.endDate,
        notes: formData.notes,
        user: {
          email: userEmail
        }
      });
      
      if (onDeadlineAdded) {
        onDeadlineAdded();
      }
      
      onClose(); // Close modal after successful submission
    } catch (error) {
      console.error('Failed to add deadline:', error);
      setErrors({
        submit: 'Failed to add deadline. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Add New Deadline</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="universityName">University/Program Name:</label>
              <input
                type="text"
                id="universityName"
                name="universityName"
                value={formData.universityName}
                onChange={handleChange}
                className={errors.universityName ? 'error' : ''}
                placeholder="e.g., Harvard University"
              />
              {errors.universityName && (
                <p className="error-message">{errors.universityName}</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={errors.startDate ? 'error' : ''}
              />
              {errors.startDate && (
                <p className="error-message">{errors.startDate}</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="endDate">End Date (Deadline):</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={errors.endDate ? 'error' : ''}
              />
              {errors.endDate && (
                <p className="error-message">{errors.endDate}</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">Notes (Optional):</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any important details about this deadline"
                rows="3"
              ></textarea>
            </div>
            
            {errors.submit && (
              <p className="error-message submit-error">{errors.submit}</p>
            )}
            
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
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Deadline'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDeadlineModal;