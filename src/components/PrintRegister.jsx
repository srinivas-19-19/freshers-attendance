import React from 'react';
import { SESSIONS, STATUSES } from '../config/constants';
import { formatDateForDisplay } from '../utils/dateUtils';

const PrintRegister = ({ printDate, rooms, students, getStudentStatus }) => {
  if (!printDate) return null;

  const displayDate = formatDateForDisplay(printDate);
  // Split out the day if it exists e.g. "August 27, 2026, Thursday" -> we format it better if we want, or just use displayDate
  // Helper to chunk students into pages of exactly 30
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  return (
    <div className="print-only print-register-container">
      {rooms.map((room) => {
        const roomStudents = students.filter(s => s.room === room.id);
        if (roomStudents.length === 0) return null;

        const chunks = chunkArray(roomStudents, 30);

        return chunks.map((chunk, index) => (
          <div key={`${room.id}-page-${index}`} className="print-room-section">
            <div className="print-header">
              <div className="print-header-brand">
                <img src={`${import.meta.env.BASE_URL}logo.png`} alt="SVCE Logo" className="print-logo" />
                <div className="print-header-text">
                  <h2>Sri Venkateshwara College of Engineering</h2>
                  <h3><strong>Department of Computer Science and Engineering</strong></h3>
                </div>
              </div>
              <div className="print-header-info">
                <h4>I B.TECH I SEMESTER ATTENDANCE</h4>
                <p>Date: {displayDate}</p>
              </div>
            </div>
            
            <div className="print-room-title">
              <strong>ROOM {room.id}</strong> {chunks.length > 1 ? `(Page ${index + 1})` : ''}<br/>
              CSE {room.range}
            </div>

            <table className="print-table">
              <thead>
                <tr>
                  <th className="col-sno">S.NO</th>
                  <th className="col-roll">ROLL NO</th>
                  <th className="col-name">STUDENT NAME</th>
                  {SESSIONS.map(session => (
                    <th key={session.id} className="text-center">{session.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chunk.map(student => (
                  <tr key={student.id}>
                    <td>{student.sNo}</td>
                    <td>{student.rollNumber || student.admnNo || student.id}</td>
                    <td>{student.name}</td>
                    {SESSIONS.map(session => {
                      const status = getStudentStatus(printDate, session.id, student.id);
                      let display = '-';
                      if (status === STATUSES.PRESENT) display = 'P';
                      if (status === STATUSES.ABSENT) display = 'A';
                      
                      return (
                        <td key={session.id} className="text-center"><strong>{display}</strong></td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="page-break"></div>
          </div>
        ));
      })}

      <div className="print-legend">
        <p><strong>P</strong> = Present &nbsp;&nbsp;&nbsp; <strong>A</strong> = Absent &nbsp;&nbsp;&nbsp; <strong>-</strong> = Not Marked</p>
        <p>Generated on: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default PrintRegister;
