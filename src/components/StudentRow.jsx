import React from 'react';
import { STATUSES } from '../config/constants';

const StudentRow = ({ student, status, onMarkAttendance }) => {
  const isPresent = status === STATUSES.PRESENT;
  const isAbsent = status === STATUSES.ABSENT;

  // We are supporting both rollNumber (from new spec) and admnNo (from old python script)
  const displayRoll = student.rollNumber || student.admnNo || '-';

  const handleMark = (statusToSet) => {
    if (status === statusToSet) {
      onMarkAttendance(student.id, STATUSES.NOT_MARKED);
    } else {
      onMarkAttendance(student.id, statusToSet);
    }
  };

  return (
    <div className="student-row">
      <div className="student-info">
        <div className="student-sno">{student.sNo}</div>
        <div className="student-roll">{displayRoll}</div>
        <div className="student-name">{student.name}</div>
      </div>
      <div className="student-actions">
        <button
          className={`status-btn btn-present ${isPresent ? 'active' : ''}`}
          onClick={() => handleMark(STATUSES.PRESENT)}
        >
          {isPresent && <span className="check-icon">✓</span>} PRESENT
        </button>
        <button
          className={`status-btn btn-absent ${isAbsent ? 'active' : ''}`}
          onClick={() => handleMark(STATUSES.ABSENT)}
        >
          {isAbsent && <span className="cross-icon">✕</span>} ABSENT
        </button>
      </div>
    </div>
  );
};

export default StudentRow;
