import React from 'react';

const AttendanceHeader = ({ onPrintClick, darkMode, onToggleDarkMode }) => {
  return (
    <header className="attendance-header">
      <div className="header-brand">
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="SVCE Logo" className="header-logo" />
        <div className="header-titles">
          <h1>Sri Venkateshwara College of Engineering</h1>
          <p className="hide-mobile">Department of Computer Science and Engineering</p>
        </div>
      </div>
      <div className="header-actions">
        <button className="btn-dark-mode" onClick={onToggleDarkMode} title="Toggle Dark Mode">
          {darkMode ? '☀️' : '🌙'}
        </button>
        <button className="btn-print" onClick={onPrintClick}>
          <span className="desktop-text">🖨️ Print Attendance</span>
          <span className="mobile-text">🖨️</span>
        </button>
      </div>
    </header>
  );
};

export default AttendanceHeader;
