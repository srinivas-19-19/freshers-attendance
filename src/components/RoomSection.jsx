import React, { useState } from 'react';
import StudentRow from './StudentRow';
import { STATUSES } from '../config/constants';

const RoomSection = ({ 
  room, 
  students, 
  getStudentStatus, 
  onMarkAttendance, 
  onMarkAllPresent,
  defaultExpanded = false
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const markedCount = students.filter(
    s => getStudentStatus(s.id) !== STATUSES.NOT_MARKED
  ).length;
  
  const totalCount = students.length;

  return (
    <div className="room-section">
      <div 
        className="room-header" 
        onClick={() => setExpanded(!expanded)}
      >
        <div className="room-title">
          <h3>ROOM {room.id}</h3>
          <span className="room-subtitle">CSE {room.range}</span>
        </div>
        <div className="room-meta">
          <button 
            className="btn-mark-all"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAllPresent(students);
            }}
          >
            Mark All Present
          </button>
          <span className="progress-indicator">
            {markedCount} / {totalCount} marked
          </span>
          <button className="expand-btn">
            {expanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="room-content">
          <div className="student-list">
            {/* Desktop Header */}
            <div className="student-list-header">
              <div className="col-sno">S.NO</div>
              <div className="col-roll">ROLL NO</div>
              <div className="col-name">STUDENT NAME</div>
              <div className="col-status">STATUS</div>
            </div>

            {students.map(student => (
              <StudentRow
                key={student.id}
                student={student}
                status={getStudentStatus(student.id)}
                onMarkAttendance={onMarkAttendance}
              />
            ))}
            {students.length === 0 && (
              <div className="empty-state">No students assigned to this room.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomSection;
