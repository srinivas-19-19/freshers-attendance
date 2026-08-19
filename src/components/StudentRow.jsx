import React from 'react';

const StudentRow = ({ student, status, onChange }) => {
  const isPresent = status === 'present';
  const isAbsent = status === 'absent';
  
  let rowClass = 'student-row';
  if (isPresent) rowClass += ' is-present';
  if (isAbsent) rowClass += ' is-absent';

  return (
    <tr className={rowClass}>
      <td>{student.sNo}</td>
      <td>{student.admnNo || '-'}</td>
      <td>{student.name}</td>
      <td>{student.mobile}</td>
      <td>
        <div className="attendance-radios">
          <label className="radio-label radio-present">
            <input 
              type="checkbox" 
              checked={isPresent}
              onChange={() => onChange(student.id, isPresent ? null : 'present')}
            />
            <span>Present</span>
          </label>
          <label className="radio-label radio-absent">
            <input 
              type="checkbox" 
              checked={isAbsent}
              onChange={() => onChange(student.id, isAbsent ? null : 'absent')}
            />
            <span>Absent</span>
          </label>
        </div>
      </td>
    </tr>
  );
};

export default StudentRow;
