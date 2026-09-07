import React, { useState } from 'react';

const AddStudentModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [section, setSection] = useState('A');
  const [error, setError] = useState('');

  const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Student name is required.');
      return;
    }
    
    onAdd(name.trim(), rollNumber.trim(), section);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal add-student-modal">
        <h2>Add New Student</h2>
        
        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="studentName">Student Name *</label>
            <input 
              type="text" 
              id="studentName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="rollNumber">Admission / Roll Number (Optional)</label>
            <input 
              type="text" 
              id="rollNumber"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="e.g. CSE123"
            />
          </div>

          <div className="form-group">
            <label htmlFor="section">Section *</label>
            <select 
              id="section"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            >
              {sections.map(s => (
                <option key={s} value={s}>CSE-{s}</option>
              ))}
            </select>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>CANCEL</button>
            <button type="submit" className="btn-primary">ADD STUDENT</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
