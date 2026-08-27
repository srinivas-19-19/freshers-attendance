import React, { useState, useMemo } from 'react';

const DeleteStudentModal = ({ students, onClose, onDelete }) => {
  const [search, setSearch] = useState('');

  const filteredStudents = useMemo(() => {
    if (!search.trim()) return [];
    const query = search.toLowerCase();
    return students.filter(s => {
      const roll = (s.rollNumber || s.admnNo || '').toLowerCase();
      const name = s.name.toLowerCase();
      const sno = (s.sNo || '').toString();
      return name.includes(query) || roll.includes(query) || sno === query;
    });
  }, [search, students]);

  return (
    <div className="modal-overlay">
      <div className="modal delete-student-modal" style={{ maxWidth: '600px', width: '90%' }}>
        <h2>Delete Student</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>
          Search by S.NO, Name, or Roll Number to find the student you want to delete.
        </p>
        
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <input 
            type="text" 
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className="delete-results" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {search.trim() && filteredStudents.length === 0 && (
            <div className="empty-state" style={{ padding: '20px' }}>No students found.</div>
          )}
          
          {filteredStudents.map(student => (
            <div key={student.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '12px',
              borderBottom: '1px solid var(--border)'
            }}>
              <div>
                <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)', marginRight: '12px' }}>
                  {student.sNo || '-'}
                </span>
                <span style={{ fontWeight: '600', marginRight: '12px' }}>{student.name}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {student.rollNumber || student.admnNo || '-'}
                </span>
              </div>
              <button 
                className="btn-delete-student" 
                style={{ opacity: 1, backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '1rem' }}
                onClick={() => {
                  if (window.confirm(`Permanently delete ${student.name}?`)) {
                    onDelete(student.id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        
        <div className="modal-actions" style={{ marginTop: '24px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>DONE</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStudentModal;
