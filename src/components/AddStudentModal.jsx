import React, { useState } from 'react';

const AddStudentModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Student name is required.');
      return;
    }
    
    onAdd(name.trim(), rollNumber.trim());
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
