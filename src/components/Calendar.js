// components/Calendar.js
import React, { useEffect, useState } from 'react';
import '../styles/calendar.css';

const Calendar = ({ onDateClick, deadlines = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  
  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, deadlines]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    // Last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Total days in the month
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Calculate days from previous month to display
    const prevMonthDays = firstDayOfWeek;
    
    // Calculate total calendar days (including prev/next month days)
    const totalCalendarDays = Math.ceil((daysInMonth + prevMonthDays) / 7) * 7;
    
    // Generate calendar days array
    const days = [];
    
    // Previous month days
    const prevMonth = new Date(year, month, 0);
    const prevMonthTotalDays = prevMonth.getDate();
    
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthTotalDays - i);
      days.push({
        date,
        dayOfMonth: date.getDate(),
        isCurrentMonth: false,
        hasDeadline: checkDeadlines(date)
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        dayOfMonth: i,
        isCurrentMonth: true,
        isToday: isToday(date),
        hasDeadline: checkDeadlines(date)
      });
    }
    
    // Next month days
    const nextMonthDays = totalCalendarDays - (prevMonthDays + daysInMonth);
    for (let i = 1; i <= nextMonthDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        dayOfMonth: i,
        isCurrentMonth: false,
        hasDeadline: checkDeadlines(date)
      });
    }
    
    setCalendarDays(days);
  };
  
  // Check if a date has any deadlines
  const checkDeadlines = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    return deadlines.some((deadline) => {
      const startDate = new Date(deadline.startDate);
      const endDate = new Date(deadline.endDate);
      const checkDate = new Date(date);
      
      // Check if the date is between start and end date
      return checkDate >= startDate && checkDate <= endDate;
    });
  };
  
  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  // Go to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Go to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Format month name
  const formatMonth = () => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };
  
  // Days of the week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="month-nav" onClick={prevMonth}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h2>{formatMonth()}</h2>
        <button className="month-nav" onClick={nextMonth}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      
      <div className="calendar-days-header">
        {daysOfWeek.map((day) => (
          <div className="calendar-day-of-week" key={day}>
            {day}
          </div>
        ))}
      </div>
      
      <div className="calendar-grid">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${day.isCurrentMonth ? '' : 'other-month'} ${
              day.isToday ? 'today' : ''
            } ${day.hasDeadline ? 'has-deadline' : ''}`}
            onClick={() => onDateClick(day.date)}
          >
            <span className="day-number">{day.dayOfMonth}</span>
            {day.hasDeadline && <div className="deadline-indicator"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;