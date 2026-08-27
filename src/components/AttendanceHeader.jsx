import React from 'react';

const AttendanceHeader = ({ onPrintClick }) => {
  return (
    <header className="attendance-header">
      <div className="header-brand">
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="SVCE Logo" className="header-logo" />
        <div className="header-titles">
          <h1>SVCE Attendance</h1>
          <span className="subtitle hide-mobile">Department of CSE</span>
        </div>
      </div>
      <div className="header-actions">
        <button className="btn-print" onClick={onPrintClick} title="Print Attendance">
          <span className="desktop-text">🖨 Print Attendance</span>
          <span className="mobile-text">🖨</span>
        </button>
      </div>
    </header>
  );
};

export default AttendanceHeader;
