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
      <div className="student-actions segmented-control">
        <button
          className={`segment-btn btn-present ${isPresent ? 'active' : ''}`}
          onClick={() => handleMark(STATUSES.PRESENT)}
        >
          <span className="desktop-text">PRESENT</span>
          <span className="mobile-text">P</span>
        </button>
        <button
          className={`segment-btn btn-absent ${isAbsent ? 'active' : ''}`}
          onClick={() => handleMark(STATUSES.ABSENT)}
        >
          <span className="desktop-text">ABSENT</span>
          <span className="mobile-text">A</span>
        </button>
      </div>
    </div>
  );
};

export default StudentRow;
