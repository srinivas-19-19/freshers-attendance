import React, { useState } from 'react';
import StudentRow from './StudentRow';
import { STATUSES } from '../config/constants';

const SectionGroup = ({ 
  section, 
  students, 
  getStudentStatus, 
  onMarkAttendance, 
  onMarkAllPresent,
  onClearAll,
  defaultExpanded = false
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const markedCount = students.filter(
    s => getStudentStatus(s.id) !== STATUSES.NOT_MARKED
  ).length;
  
  const totalCount = students.length;

  return (
    <div className="section-group">
      <div 
        className="section-header" 
        onClick={() => setExpanded(!expanded)}
      >
        <div className="section-title">
          <h3>SECTION {section.id}</h3>
          <span className="section-subtitle">Room {section.room} ({section.range})</span>
        </div>
        <div className="section-meta">
          <button 
            className="btn-mark-all"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAllPresent(students);
            }}
          >
            Mark All Present
          </button>
          <button 
            className="btn-clear-all"
            onClick={(e) => {
              e.stopPropagation();
              if(window.confirm("Are you sure you want to clear all attendance for this section?")) {
                onClearAll(students);
              }
            }}
          >
            Clear All
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
        <div className="section-content">
          <div className="student-list">
            {/* Desktop Header */}
            <div className="student-list-header">
              <div className="col-sno">S.NO</div>
              <div className="col-roll">ROLL/ADMN NO</div>
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
              <div className="empty-state">No students assigned to this section.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionGroup;
