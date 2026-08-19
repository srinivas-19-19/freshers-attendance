import React, { useState } from 'react';
import StudentRow from './StudentRow';

const RoomSection = ({ room, students, attendanceState, onAttendanceChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const total = students.length;
  const present = students.filter(s => attendanceState[s.id] === 'present').length;
  const absent = students.filter(s => attendanceState[s.id] === 'absent').length;

  // Group label logic
  let label = `Room ${room}`;
  if (room === '10101') label += ' (CSE 1-60)';
  else if (room === '10102') label += ' (CSE 61-120)';
  else if (room === '10103') label += ' (CSE 121-180)';
  else if (room === '10104') label += ' (CSE 181-240)';
  else if (room === '10105') label += ' (CSE 241-300)';
  else if (room === '10106') label += ' (CSE 301-360)';
  else if (room === '10201') label += ' (CSE 361-433)';
  else if (room === '10108') label += ' (CAI 1-52)';

  return (
    <div className="room-section">
      <div className="room-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="room-label">{label}</div>
        <div className="room-stats">
          <span className="stat-badge total">Total: {total}</span>
          <span className="stat-badge present">P: {present}</span>
          <span className="stat-badge absent">A: {absent}</span>
          <span className="toggle-icon">{isOpen ? '▲' : '▼'}</span>
        </div>
      </div>
      
      {isOpen && (
        <div className="room-content">
          <table className="student-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Admn No</th>
                <th>Name of the Student</th>
                <th>Mobile Number</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <StudentRow 
                  key={student.id} 
                  student={student} 
                  status={attendanceState[student.id]}
                  onChange={onAttendanceChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RoomSection;
