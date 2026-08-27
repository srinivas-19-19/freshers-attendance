import React from 'react';

const AttendanceHeader = ({ onPrintClick }) => {
  return (
    <header className="attendance-header">
      <div className="header-left">
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="SVCE Logo" className="header-logo" />
        <div className="header-text">
          <h1>Sri Venkateshwara College of Engineering</h1>
          <div className="subtitle">
            <span>Department of CSE</span>
          </div>
        </div>
      </div>
      <div className="header-right">
        <button className="btn-print" onClick={onPrintClick}>
          🖨 Print Attendance
        </button>
      </div>
    </header>
  );
};

export default AttendanceHeader;
