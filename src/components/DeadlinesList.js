// components/DeadlinesList.js
import React, { useState } from 'react';
import '../styles/deadlines.css';
import DeadlineItem from './DeadlineItem';

const DeadlinesList = ({ deadlines }) => {
  const [sortBy, setSortBy] = useState('endDate');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Sort deadlines
  const sortedDeadlines = [...deadlines].sort((a, b) => {
    let valueA, valueB;

    if (sortBy === 'universityName') {
      valueA = a.universityName.toLowerCase();
      valueB = b.universityName.toLowerCase();
    } else if (sortBy === 'startDate') {
      valueA = new Date(a.startDate);
      valueB = new Date(b.startDate);
    } else {
      valueA = new Date(a.endDate);
      valueB = new Date(b.endDate);
    }

    if (sortOrder === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  return (
    <div className="deadlines-list-container">
      <div className="deadlines-controls">
        <div className="sort-controls">
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="endDate">Sort by End Date</option>
            <option value="startDate">Sort by Start Date</option>
            <option value="universityName">Sort by Name</option>
          </select>

          <button
            className="sort-order-btn"
            onClick={toggleSortOrder}
            aria-label={sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
          >
            <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
          </button>
        </div>
      </div>

      <div className="deadlines-grid">
        {sortedDeadlines.map((deadline) => (
          <DeadlineItem key={deadline.id} deadline={deadline} />
        ))}
      </div>
    </div>
  );
};

export default DeadlinesList;