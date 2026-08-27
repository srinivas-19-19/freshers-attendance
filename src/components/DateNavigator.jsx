import React from 'react';
import { addDaysToDate, formatDateForDisplay } from '../utils/dateUtils';

const DateNavigator = ({ selectedDateId, onDateChange }) => {
  return (
    <div className="date-navigator-container">
      <div className="date-navigator">
        <button 
          className="date-nav-btn"
          onClick={() => onDateChange(addDaysToDate(selectedDateId, -1))}
        >
          ‹ Previous Day
        </button>
        
        <div className="date-picker-wrapper">
          <label htmlFor="date-picker" className="date-display">
            <span className="calendar-icon">📅</span>
            {formatDateForDisplay(selectedDateId)}
          </label>
          <input 
            type="date" 
            id="date-picker"
            className="hidden-date-input"
            value={selectedDateId}
            onChange={(e) => {
              if (e.target.value) {
                onDateChange(e.target.value);
              }
            }}
          />
        </div>

        <button 
          className="date-nav-btn"
          onClick={() => onDateChange(addDaysToDate(selectedDateId, 1))}
        >
          Next Day ›
        </button>
      </div>
    </div>
  );
};

export default DateNavigator;
