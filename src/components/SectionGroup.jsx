import React, { useState, useRef } from 'react';
import StudentRow from './StudentRow';
import { STATUSES } from '../config/constants';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

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
  const containerRef = useRef();

  useGSAP(() => {
    if (expanded) {
      let mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from('.student-row', {
          opacity: 0,
          scale: 0.98,
          y: 16,
          duration: 0.4,
          stagger: { each: 0.04, from: 'start' },
          ease: 'back.out(1.4)'
        });
      });
      return () => mm.revert();
    }
  }, { scope: containerRef, dependencies: [expanded] });

  const markedCount = students.filter(
    s => getStudentStatus(s.id) !== STATUSES.NOT_MARKED
  ).length;
  
  const totalCount = students.length;

  return (
    <div className="section-group" ref={containerRef}>
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
