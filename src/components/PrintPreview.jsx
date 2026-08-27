import React from 'react';
import { formatDateForDisplay } from '../utils/dateUtils';

const PrintPreview = ({ selectedPrintDate, onDateChange, onCancel, onPrint }) => {
  return (
    <div className="modal-overlay">
      <div className="modal print-preview-modal">
        <h2>PRINT DAILY ATTENDANCE</h2>
        
        <div className="print-date-selection">
          <label htmlFor="print-date-picker">Select Date</label>
          <div className="date-picker-wrapper">
            <span className="calendar-icon">📅</span>
            <input 
              type="date" 
              id="print-date-picker"
              value={selectedPrintDate}
              onChange={(e) => {
                if (e.target.value) onDateChange(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="print-info">
          <p>This will print: <strong>{formatDateForDisplay(selectedPrintDate)}</strong></p>
          <ul className="print-checklist">
            <li>✓ Forenoon Attendance</li>
            <li>✓ Afternoon Attendance</li>
            <li>✓ All Rooms</li>
            <li>✓ All Students</li>
          </ul>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>CANCEL</button>
          <button className="btn-primary" onClick={onPrint}>PRINT</button>
        </div>
      </div>
    </div>
  );
};

export default PrintPreview;
